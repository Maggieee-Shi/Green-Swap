import groovy.json.JsonSlurper
import groovy.json.JsonOutput

def server  = vars.get("SERVER") ?: "localhost"
def port    = vars.get("PORT")   ?: "8082"
def base    = "http://${server}:${port}"
def slurper = new JsonSlurper()

def httpPost = { String path, Map bodyMap, String token = null ->
    def url  = new URL("${base}${path}")
    def conn = url.openConnection()
    conn.setRequestMethod("POST")
    conn.setRequestProperty("Content-Type", "application/json")
    if (token) conn.setRequestProperty("Authorization", "Bearer ${token}")
    conn.setDoOutput(true)
    def body = JsonOutput.toJson(bodyMap)
    conn.outputStream.withWriter("UTF-8") { w -> w.write(body) }
    def code = conn.responseCode
    def text = ""
    try {
        text = conn.inputStream.text
    } catch (Exception ignored) {
        text = conn.errorStream?.text ?: ""
    }
    return [code: code, body: text]
}

log.info("=== SETUP START ===")

// 1. Register seller
def sellResp = httpPost("/api/auth/register", [name: "Test Seller", email: "seller_concurrent@greenswap.test", password: "password123"])
if (sellResp.code != 200 && sellResp.code != 201) {
    sellResp = httpPost("/api/auth/login", [email: "seller_concurrent@greenswap.test", password: "password123"])
}
def sellerJson  = slurper.parseText(sellResp.body)
def sellerToken = sellerJson.token as String
log.info("Seller token: ${sellerToken?.take(30)}...")

// 2. Create product with inventory = 5
def prodResp = httpPost("/api/products", [
    name:        "Titleist Pro V1 Golf Balls (CONCURRENCY TEST)",
    description: "50 buyers race simultaneously — only 5 in stock",
    price:       49.99,
    inventory:   5,
    category:    "BALLS",
    condition:   "EXCELLENT",
    brand:       "Titleist",
    location:    "San Francisco, CA"
], sellerToken)
def product   = slurper.parseText(prodResp.body)
def productId = product.id as String
props.setProperty("PRODUCT_ID", productId)
log.info("Product created: ID=${productId}, inventory=${product.inventory}")

// 3. Register 50 buyer accounts
for (int i = 1; i <= 50; i++) {
    def email = "buyer${i}@greenswap.test"
    def resp  = httpPost("/api/auth/register", [name: "Buyer ${i}", email: email, password: "password123"])
    if (resp.code != 200 && resp.code != 201) {
        // Already exists — that's fine, PreProcessor will login fresh each time
        log.debug("Buyer ${i} already exists (${resp.code}), will login fresh in threads")
    }
}
log.info("50 buyer accounts ready. Setup complete.")

SampleResult.setSuccessful(true)
SampleResult.setResponseCodeOK()
SampleResult.setResponseMessage("Setup OK — productId=${productId}")
