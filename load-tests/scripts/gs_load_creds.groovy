import groovy.json.JsonSlurper
import groovy.json.JsonOutput

def server    = vars.get("SERVER") ?: "localhost"
def port      = vars.get("PORT")   ?: "8082"
def threadNum = ctx.getThreadNum() + 1
def email     = "buyer${threadNum}@greenswap.test"

// Login and get a fresh JWT for this thread
def url  = new URL("http://${server}:${port}/api/auth/login")
def conn = url.openConnection()
conn.setRequestMethod("POST")
conn.setRequestProperty("Content-Type", "application/json")
conn.setDoOutput(true)
conn.outputStream.withWriter("UTF-8") { w ->
    w.write(JsonOutput.toJson([email: email, password: "password123"]))
}

def code = conn.responseCode
def text = ""
try {
    text = conn.inputStream.text
} catch (Exception ignored) {
    text = conn.errorStream?.text ?: ""
}

def productId = props.getProperty("PRODUCT_ID") ?: "MISSING"

if (code == 200 || code == 201) {
    def token = new JsonSlurper().parseText(text).token as String
    vars.put("MY_TOKEN",      token)
    vars.put("MY_PRODUCT_ID", productId)
    log.info("[T${threadNum}] Login OK for ${email}, productId=${productId}")
} else {
    log.error("[T${threadNum}] Login FAILED (${code}): ${text?.take(100)}")
    vars.put("MY_TOKEN",      "INVALID")
    vars.put("MY_PRODUCT_ID", productId)
}
