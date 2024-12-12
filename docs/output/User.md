<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [new User(data)](#new_User_new)
    * _instance_
        * [.id](#User+id) ⇒
        * [.username](#User+username) ⇒
        * [.discriminator](#User+discriminator) ⇒
        * [.avatar](#User+avatar) ⇒
        * [.tag](#User+tag) ⇒
        * [.public_flags](#User+public_flags) ⇒
        * [.display_name](#User+display_name) ⇒
        * [.avatar_decoration](#User+avatar_decoration) ⇒ <code>string</code>
        * [.displayAvatarURL()](#User+displayAvatarURL) ⇒
    * _static_
        * [.send(userId, message, client)](#User.send) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="new_User_new"></a>

### new User(data)
Constructs a new instance of the User class.


| Param | Description |
| --- | --- |
| data | The data object containing user information. |

<a name="User+id"></a>

### user.id ⇒
Gets the ID of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The ID of the user.  
<a name="User+username"></a>

### user.username ⇒
Gets the username of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The username of the user.  
<a name="User+discriminator"></a>

### user.discriminator ⇒
Gets the discriminator of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The discriminator value.  
<a name="User+avatar"></a>

### user.avatar ⇒
Gets the avatar of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The avatar of the user.  
<a name="User+tag"></a>

### user.tag ⇒
Gets the tag of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The tag of the user.  
<a name="User+public_flags"></a>

### user.public\_flags ⇒
Gets the public flags of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The public flags of the user.  
<a name="User+display_name"></a>

### user.display\_name ⇒
Gets the display name of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: The display name of the user.  
<a name="User+avatar_decoration"></a>

### user.avatar\_decoration ⇒ <code>string</code>
Gets the avatar decoration of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: <code>string</code> - The avatar decoration value.  
<a name="User+displayAvatarURL"></a>

### user.displayAvatarURL() ⇒
Returns the URL of the user's avatar image.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: The URL of the user's avatar image.  
<a name="User.send"></a>

### User.send(userId, message, client) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a message to a user.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A Promise that resolves to the sent message.  

| Param | Description |
| --- | --- |
| userId | The ID of the user to send the message to. |
| message | The message to send. |
| client | The Discord client instance. |

