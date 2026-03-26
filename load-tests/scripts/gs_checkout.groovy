import groovy.json.JsonOutput

def server    = vars.get("SERVER")       ?: "localhost"
def port      = vars.get("PORT")         ?: "8082"
def token     = vars.get("MY_TOKEN")     ?: ""
def productId = vars.get("MY_PRODUCT_ID") ?: ""
def threadNum = ctx.getThreadNum() + 1

def orderBody = JsonOutput.toJson([
    items: [[productId: productId, quantity: 1]],
    shippingAddress: [
        address: "123 Golf Lane",
        city:    "San Francisco",
        state:   "CA",
        zipCode: "94102"
    ]
])

def url  = new URL("http://${server}:${port}/api/orders")
def conn = url.openConnection()
conn.setRequestMethod("POST")
conn.setRequestProperty("Content-Type", "application/json")
conn.setRequestProperty("Authorization", "Bearer ${token}")
conn.setDoOutput(true)
conn.outputStream.withWriter("UTF-8") { w -> w.write(orderBody) }

def responseCode = conn.responseCode
def responseBody = ""
try {
    responseBody = conn.inputStream.text
} catch (Exception ignored) {
    responseBody = conn.errorStream?.text ?: ""
}

// Report to JMeter
SampleResult.setResponseCode(responseCode as String)
if (responseCode == 200 || responseCode == 201) {
    SampleResult.setSuccessful(true)
    SampleResult.setResponseMessage("Order created")
    SampleResult.setResponseData(responseBody, "UTF-8")
    log.info("[T${threadNum}] SUCCESS (${responseCode}) — inventory decremented")
} else {
    SampleResult.setSuccessful(false)
    SampleResult.setResponseMessage("Rejected: ${responseCode}")
    SampleResult.setResponseData(responseBody, "UTF-8")
    log.info("[T${threadNum}] REJECTED (${responseCode}) — ${responseBody?.take(100)}")
}
