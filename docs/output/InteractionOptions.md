<a name="InteractionOptions"></a>

## InteractionOptions
**Kind**: global class  

* [InteractionOptions](#InteractionOptions)
    * [new InteractionOptions(data, interaction)](#new_InteractionOptions_new)
    * [.getString(name)](#InteractionOptions+getString) ⇒ <code>string</code>
    * [.getInteger(name)](#InteractionOptions+getInteger) ⇒ <code>number</code>
    * [.getNumber(name)](#InteractionOptions+getNumber) ⇒ <code>number</code>
    * [.getBoolean(name)](#InteractionOptions+getBoolean) ⇒ <code>boolean</code>
    * [.getSubcommand()](#InteractionOptions+getSubcommand) ⇒ <code>string</code>
    * [.getChannel(name)](#InteractionOptions+getChannel) ⇒
    * [.getUser(name)](#InteractionOptions+getUser) ⇒

<a name="new_InteractionOptions_new"></a>

### new InteractionOptions(data, interaction)
Constructs a new instance of the InteractionOptions class.


| Param | Description |
| --- | --- |
| data | The data for the InteractionOptions. |
| interaction | The interaction associated with the InteractionOptions. |

<a name="InteractionOptions+getString"></a>

### interactionOptions.getString(name) ⇒ <code>string</code>
Retrieves the string value associated with the given name.
If the name is found in the options array, the corresponding value is returned.
If the name is not found in the options array, the first value found in the nested options array is returned.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: <code>string</code> - The string value associated with the given name, or undefined if the name is not found.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the string value to retrieve. |

<a name="InteractionOptions+getInteger"></a>

### interactionOptions.getInteger(name) ⇒ <code>number</code>
Retrieves the integer value associated with the given name.
If the name is found in the options array, the corresponding value is returned.
If the name is not found in the options array, the first value found in the nested options array is returned.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: <code>number</code> - The integer value associated with the given name, or undefined if the name is not found.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the integer value to retrieve. |

<a name="InteractionOptions+getNumber"></a>

### interactionOptions.getNumber(name) ⇒ <code>number</code>
Retrieves the number value associated with the given name.
If the name is found in the options array, the corresponding value is returned.
If the name is not found in the options array, the first value found in the nested options array is returned.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: <code>number</code> - The number value associated with the given name, or undefined if the name is not found.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the number value to retrieve. |

<a name="InteractionOptions+getBoolean"></a>

### interactionOptions.getBoolean(name) ⇒ <code>boolean</code>
Retrieves the boolean value associated with the given name.
If the name is found in the options array, the corresponding value is returned.
If the name is not found in the options array, the first value found in the nested options array is returned.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: <code>boolean</code> - The boolean value associated with the given name, or undefined if the name is not found.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the boolean value to retrieve. |

<a name="InteractionOptions+getSubcommand"></a>

### interactionOptions.getSubcommand() ⇒ <code>string</code>
Retrieves the subcommand name associated with the interaction.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: <code>string</code> - The subcommand name, or undefined if no subcommand is found.  
<a name="InteractionOptions+getChannel"></a>

### interactionOptions.getChannel(name) ⇒
Retrieves the channel ID based on the provided name.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: The ID of the channel, or null if not found.  

| Param | Description |
| --- | --- |
| name | The name of the channel. |

<a name="InteractionOptions+getUser"></a>

### interactionOptions.getUser(name) ⇒
Retrieves a user based on their name.

**Kind**: instance method of [<code>InteractionOptions</code>](#InteractionOptions)  
**Returns**: The resolved user object, or null if the user is not found.  

| Param | Description |
| --- | --- |
| name | The name of the user to retrieve. |

