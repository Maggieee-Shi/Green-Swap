import groovy.json.JsonSlurper

def server    = vars.get("SERVER") ?: "localhost"
def port      = vars.get("PORT")   ?: "8082"
def productId = props.get("PRODUCT_ID")
def startingInventory = 5
def totalBuyers       = 50

// Fetch final product state
def url  = new URL("http://${server}:${port}/api/products/${productId}")
def conn = url.openConnection()
conn.setRequestMethod("GET")
def json = new JsonSlurper().parseText(conn.inputStream.text)

def finalInventory = json.inventory as int
def succeeded      = startingInventory - finalInventory
def rejected       = totalBuyers - succeeded
def oversold       = finalInventory < 0
def undersold      = succeeded < startingInventory && finalInventory > 0  // stock left unexpectedly
def pass           = (finalInventory == 0 && succeeded == startingInventory && rejected == (totalBuyers - startingInventory))

def verdict = pass ? "PASS — Pessimistic lock working correctly! No overselling." :
              oversold ? "FAIL — OVERSOLD! Inventory went negative. Race condition detected!" :
              "FAIL — Inventory mismatch (final=${finalInventory}, expected=0)"

def report = """
╔══════════════════════════════════════════════════════════╗
║         GREENSWAP CONCURRENCY TEST — FINAL RESULTS       ║
╠══════════════════════════════════════════════════════════╣
║  Product ID       : ${productId?.padRight(12)} (check /api/products/${productId})
║  Starting stock   : ${startingInventory}
║  Concurrent users : ${totalBuyers}
╠══════════════════════════════════════════════════════════╣
║  Orders SUCCEEDED : ${succeeded} (expected: ${startingInventory})
║  Orders REJECTED  : ${rejected} (expected: ${totalBuyers - startingInventory})
║  Final inventory  : ${finalInventory} (expected: 0)
╠══════════════════════════════════════════════════════════╣
║  Result: ${verdict}
╚══════════════════════════════════════════════════════════╝"""

log.info(report)
SampleResult.setSuccessful(pass)
SampleResult.setResponseCode(pass ? "200" : "500")
SampleResult.setResponseMessage(pass ? "PASS" : "FAIL")
SampleResult.setResponseData(report, "UTF-8")