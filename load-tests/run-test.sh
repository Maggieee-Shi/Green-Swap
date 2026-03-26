#!/bin/bash
# GreenSwap Concurrency Test Runner
# Usage:
#   ./load-tests/run-test.sh                          # default: localhost:8082
#   ./load-tests/run-test.sh --server staging.app.com --port 443

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS_DIR="$REPO_ROOT/load-tests/scripts"
JMX="$REPO_ROOT/load-tests/greenswap-concurrency-test.jmx"
RESULTS="$REPO_ROOT/load-tests/results.csv"
LOG="$REPO_ROOT/load-tests/jmeter.log"

SERVER="localhost"
PORT="8082"

while [[ $# -gt 0 ]]; do
  case $1 in
    --server) SERVER="$2"; shift 2 ;;
    --port)   PORT="$2";   shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

echo "Running concurrency test against http://${SERVER}:${PORT}"
echo "Scripts : $SCRIPTS_DIR"
echo "Results : $RESULTS"
echo ""

jmeter -n \
  -t  "$JMX" \
  -JSCRIPTS_DIR="$SCRIPTS_DIR" \
  -JSERVER="$SERVER" \
  -JPORT="$PORT" \
  -JRESULTS_FILE="$RESULTS" \
  -l  "$RESULTS" \
  -j  "$LOG"

echo ""
echo "Log     : $LOG"
echo "Results : $RESULTS"
