-- The minimum-commission floor now falls entirely on the pharmacy.
--
-- It used to be split 70/30 like any other commission, so a 20,000 IQD shift
-- cost the pharmacist 750 rather than the 600 the percentage alone gives. The
-- same 150 dinars is 0.7% of what the pharmacy is charged and 25% of what the
-- pharmacist is deducted, and it is the pharmacy that creates the cost the floor
-- exists to cover, by posting a shift too small to pay for its own processing.
--
-- The rule this buys: the pharmacist pays 3% of the shift value, always. One
-- sentence, no exceptions, nothing that reads as the platform taking more from
-- the smallest jobs.
--
-- Mirrors calculateFees() in src/config/fees.ts. Both are tested on the same
-- cases, so drift shows up as a failing test. If you change one, change the
-- other.
--
-- Existing bookings are untouched: their fees were computed at acceptance and
-- are a record of what was actually charged, not a value to recompute.

create or replace function public.calculate_fees(
  gross_amount numeric,
  pharmacy_in_trial boolean,
  pharmacist_in_trial boolean
)
returns public.fee_breakdown
language plpgsql
stable
as $$
declare
  cfg public.fee_config;
  percentage_commission numeric;
  chargeable numeric;
  full_pharmacy_fee numeric;
  full_pharmacist_fee numeric;
  result public.fee_breakdown;
begin
  if gross_amount is null or gross_amount < 0 then
    raise exception 'Invalid gross amount: %', gross_amount;
  end if;

  select * into cfg from public.fee_config where id;

  percentage_commission := gross_amount * cfg.total_commission_rate;
  result.floor_applied := gross_amount > 0 and percentage_commission < cfg.minimum_commission_iqd;

  chargeable := case
    when gross_amount = 0 then 0
    else greatest(percentage_commission, cfg.minimum_commission_iqd)
  end;

  -- Off the percentage, never off the floored commission, so a floored shift
  -- costs the pharmacist exactly what an unfloored one would. Above the floor
  -- the two are identical and this is an ordinary 70/30 split.
  full_pharmacist_fee := round(percentage_commission * (1 - cfg.pharmacy_share));
  -- Derived by subtraction so both sides always reconcile to the commission.
  -- The floor's whole excess lands here, on the pharmacy.
  full_pharmacy_fee := round(chargeable) - full_pharmacist_fee;

  result.gross_amount := gross_amount;
  result.pharmacy_fee := case when pharmacy_in_trial then 0 else full_pharmacy_fee end;
  result.pharmacist_fee := case when pharmacist_in_trial then 0 else full_pharmacist_fee end;
  result.pharmacy_charge := gross_amount + result.pharmacy_fee;
  result.pharmacist_net := gross_amount - result.pharmacist_fee;
  result.platform_gross := result.pharmacy_fee + result.pharmacist_fee;
  result.processor_fee := round(result.pharmacist_net * cfg.processor_fee_rate);
  result.platform_net := result.platform_gross - result.processor_fee;
  result.floor_applied := result.floor_applied
    and not (pharmacy_in_trial and pharmacist_in_trial);

  return result;
end;
$$;
