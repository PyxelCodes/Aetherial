<a name="Message"></a>

## Message
**Kind**: global class  

* [Message](#Message)
    * [new Message(data, client)](#new_Message_new)
    * _instance_
        * [.embeds](#Message+embeds) ⇒ <code>Array.&lt;MessageEmbed&gt;</code>
        * [.attachments](#Message+attachments) ⇒
        * [.id](#Message+id) ⇒ <code>string</code>
        * [.author](#Message+author) ⇒ <code>MessageAuthor</code>
        * [.content](#Message+content) ⇒ <code>string</code>
        * [.channel](#Message+channel) ⇒ <code>string</code>
        * [.guild](#Message+guild) ⇒ <code>string</code>
        * [.removeAttachments()](#Message+removeAttachments) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.staticEdit(channel_id, message_id, data)](#Message+staticEdit) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.edit(data)](#Message+edit) ⇒
        * [.reply(text)](#Message+reply) ⇒ <code>Promise.&lt;void&gt;</code>
    * _static_
        * [.edit(IMessage, client, data)](#Message.edit) ⇒

<a name="new_Message_new"></a>

### new Message(data, client)
Constructs a new Message object.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>MessageData</code> | The data for the message. |
| client | <code>Interaction</code> \| <code>ShardInteraction</code> | The interaction client. |

<a name="Message+embeds"></a>

### message.embeds ⇒ <code>Array.&lt;MessageEmbed&gt;</code>
Gets the embeds of the message.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>Array.&lt;MessageEmbed&gt;</code> - An array of MessageEmbed objects representing the embeds of the message.  
<a name="Message+attachments"></a>

### message.attachments ⇒
Gets the attachments of the message.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: An array of MessageAttachment objects representing the attachments.  
<a name="Message+id"></a>

### message.id ⇒ <code>string</code>
Gets the ID of the message.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> - The ID of the message.  
**Access**: public  
**Read only**: true  
<a name="Message+author"></a>

### message.author ⇒ <code>MessageAuthor</code>
Gets the author of the message.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>MessageAuthor</code> - The author of the message.  
**Access**: public  
**Read only**: true  
<a name="Message+content"></a>

### message.content ⇒ <code>string</code>
Gets the content of the message.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> - The content of the message as a string.  
**Access**: public  
**Read only**: true  
<a name="Message+channel"></a>

### message.channel ⇒ <code>string</code>
Gets the channel ID.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> - The channel ID.  
**Access**: public  
**Read only**: true  
<a name="Message+guild"></a>

### message.guild ⇒ <code>string</code>
Retrieves the guild ID associated with this message.

**Kind**: instance property of [<code>Message</code>](#Message)  
**Returns**: <code>string</code> - The guild ID as a string.  
**Access**: public  
**Read only**: true  
<a name="Message+removeAttachments"></a>

### message.removeAttachments() ⇒ <code>Promise.&lt;void&gt;</code>
Removes attachments from the message.

**Kind**: instance method of [<code>Message</code>](#Message)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the attachments are removed.  
**Access**: public  
<a name="Message+staticEdit"></a>

### message.staticEdit(channel_id, message_id, data) ⇒ <code>Promise.&lt;void&gt;</code>
Edits a message in a channel.

**Kind**: instance method of [<code>Message</code>](#Message)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the message is successfully edited.  
**Access**: public  

| Param | Description |
| --- | --- |
| channel_id | The ID of the channel where the message is located. |
| message_id | The ID of the message to be edited. |
| data | The updated data for the message. |

<a name="Message+edit"></a>

### message.edit(data) ⇒
Edits the message with the provided data.

**Kind**: instance method of [<code>Message</code>](#Message)  
**Returns**: A Promise that resolves when the message is successfully edited.  
**Access**: public  

| Param | Description |
| --- | --- |
| data | The data to update the message with. |

<a name="Message+reply"></a>

### message.reply(text) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a reply message to the channel.

**Kind**: instance method of [<code>Message</code>](#Message)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the reply message is sent.  
**Access**: public  

| Param | Description |
| --- | --- |
| text | The text content of the reply message. |

<a name="Message.edit"></a>

### Message.edit(IMessage, client, data) ⇒
Edits a message.

**Kind**: static method of [<code>Message</code>](#Message)  
**Returns**: A promise that resolves when the message is edited.  
**Access**: public  

| Param | Description |
| --- | --- |
| IMessage | The message to edit. |
| client | The client object. |
| data | The data to update the message with. |

