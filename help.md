### `PREFroll (dice syntax) [# comment]`
-# also `PREFd`
> Rolls die based on the given dice syntax. If it works in Tupper, it'll work here.
> -# Comments are optional and start with ` # `.

### `PREFchoose (one|two|three) [# comment]`
-# also `PREFch`
> Chooses a result based on a list given, separated by `|`.
> -# Comments are optional and start with ` # `.

### `PREFcoinflip [# comment]`
-# also `PREFcoin` or `PREFflip`
> Flips a coin.
> -# Comments are optional and start with ` # `.

### `PREFtext (format) (text to be formatted)`
-# also `PREFt`
> Takes the text to be formatted and stylizes it with special characters.
> Accepted formats: `bold`, `smallcaps`, `superscript`, `typewriter`, `double`, `cursive`, `cursbold`, `gothic`, `gothbold`, `wide`

### `PREFchara [chara name|user]`
-# also `PREFcharacter` or `PREFchar`
> Fetches character information for yourself, or for a specified character or user.

### `PREFinv [chara name|user]`
-# also `PREFinventory`
> Fetches inventory information for yourself, or for a specified character or user.
> -# *Warning:* Might get long. Some of you guys have so much shit.

### `PREFpool (name) [amount]`
> Rolls a result out of the given command pool name, with an optional amount if the command allows it.
> If you don't know what this command does, don't worry about it. :)
> -# *Hint:* Most of the times, you can also directly do `PREF(name) [amount]` instead.

### `PREFembed (json)`
> Creates an embed using given JSON. try [this](https://embed.dan.onl/).