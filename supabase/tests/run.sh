#!/usr/bin/env bash
# Rebuild a throwaway database from the migrations and run the policy tests
# against it. Point PGHOST/PGPORT/PGUSER at any Postgres 15+ instance.
#
#   ./supabase/tests/run.sh
set -euo pipefail

DB="${TEST_DB:-saydali_test}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

psql -q -c "drop database if exists ${DB};" -c "create database ${DB};"
psql -q -d "${DB}" -v ON_ERROR_STOP=1 -f "${ROOT}/supabase/tests/harness.sql"

for migration in "${ROOT}"/supabase/migrations/*.sql; do
  echo "applying $(basename "${migration}")"
  psql -q -d "${DB}" -v ON_ERROR_STOP=1 -f "${migration}"
done

psql -d "${DB}" -v ON_ERROR_STOP=1 -f "${ROOT}/supabase/tests/rls.sql"
