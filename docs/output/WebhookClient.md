<a name="WebhookClient"></a>

## WebhookClient
**Kind**: global class  

* [WebhookClient](#WebhookClient)
    * [new WebhookClient(data)](#new_WebhookClient_new)
    * [.send(data)](#WebhookClient+send)
    * [.parseWebhookURL(url)](#WebhookClient+parseWebhookURL) ⇒

<a name="new_WebhookClient_new"></a>

### new WebhookClient(data)
Constructs a new WebhookClient.

**Throws**:

- <code>Error</code> Throws an error if the provided URL is invalid.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The data object containing the properties for the WebhookClient. |
| data.id | <code>string</code> | The ID of the webhook. |
| data.token | <code>string</code> | The token of the webhook. |
| [data.url] | <code>string</code> | The URL of the webhook. |

<a name="WebhookClient+send"></a>

### webhookClient.send(data)
Sends the provided data as an interaction reply.

**Kind**: instance method of [<code>WebhookClient</code>](#WebhookClient)  
**Throws**:

- <code>Error</code> - Throws an error if no token is provided.


| Param | Description |
| --- | --- |
| data | The data to be sent as the interaction reply. |

<a name="WebhookClient+parseWebhookURL"></a>

### webhookClient.parseWebhookURL(url) ⇒
Parses a webhook URL and extracts the webhook ID and token.

**Kind**: instance method of [<code>WebhookClient</code>](#WebhookClient)  
**Returns**: An object containing the webhook ID and token, or null if the URL is invalid.  

| Param | Description |
| --- | --- |
| url | The webhook URL to parse. |

