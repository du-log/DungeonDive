Entity: User
|Column|Type|Description|
|:---|:---|:---|
|user_id|Integer(PK)|Unique ID|
|name|String|User's Name|
|gold|Integer|Current amount of Gold|

Entity: Adventurer
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique ID|
|user_id|Integer(FK)|Links to respective user|
|name|String|Character Name|
|level|Integer|Current Level(stats scale based on)|
|experience|Integer|Current Experience Amount|
|class|String|Character's class|
|current_hp|Integer|Tracked for dungeon end logic|
|max_hp|Integer|Maximum HP for status display|
|str|Integer|Character STR stat, influences damage for melee|
|con|Integer|Character CON stat, influences HP|
|int|Integer|Character INT stat, influences damage for magic|
|will|Integer|Character WILL stat, influences healing|
|luck|Integer|Character LUCK stat, influences critical hits|

Entity: Inventory
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique ID|
|adventurer_id|Integer(FK)|Links to respective character|
|item_name|String|Name of the item or loot|