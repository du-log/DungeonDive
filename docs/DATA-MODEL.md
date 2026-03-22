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
|speed|Integer|Character's speed for combat|
|stat_points|Integer|Character's available stat points|
|skill_points|Integer|Character's available skill points|
|in_party|Boolean|For choosing the party members|
|in_combat_party|Boolean|For choosing the combat party members|
|current_energy|Integer|For Ultimate skills|


Entity: Skill
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique ID|
|name|String|Skill Name|
|description|String|Skill Description|
|base_multiplier|Float|Skill Multiplier|
|cooldown_turns|Integer|Base cooldown|
|energy_gain|Integer|Energy gained for ultimate attacks|
|effect_type|String|Indicates if it has an effect (poison, heal, etc.)|
|target_type|String|single, all, self|
|effect_id|Integer(FK)|For active effects|

Entity: Status Effects
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique ID|
|target_id|Integer|Indicates target with a status effect|
|target_type|String|adventurer, enemy|
|effect_type|String|The effect type (poison, heal, etc)|
|magnitude|Float|The magnitude of the effect|
|duration|Integer|How many turns the effect lasts|

Entity: Character Skills (Link)
|Column|Type|Description|
|:---|:---|:---|
|adventurer_id|Integer(FK)|Adventurer ID|
|skill_id|Integer(FK)|Skill ID|
|slot_number|Integer|1, 2, 3|
|current_cooldown|Integer|Current cooldown for adventurer's skill|

Entity: Enemy
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique ID|
|name|String|Name of enemy|
|level|Integer|Enemy level, influences XP|
|max_hp|Integer|Enemy base HP|
|str|Integer|Enemy strength stat|
|dex|Integer|Enemy dexterity stat|
|int|Integer|Enemy intelligence stat|
|will|Integer|Enemy will stat|
|luck|Integer|Enemy luck stat|
|speed|Integer|Turn order determine|
|xp_reward|Integer|XP gained by party|

Entity: Battle Instance (Live state)
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique Instance ID|
|battle_id|Integer|ID for tracking battles|
|unit_type|String|Check if adventurer or enemy|
|unit_id|Integer(FK)|Links to adventurer/enemy table|
|current_hp|Integer|Unit's current hp|
|max_hp|Integer|Unit's max hp|
|current_energy|Integer|Unit's current energy in battle for ultimate skills|
|readiness|Float|Unit's readiness 0 to 100|
|position|Integer|0, 1, 2 (Left, Center, Right)|
|is_dead|Boolean|Quick check for unit status in React|

Entity: Inventory
|Column|Type|Description|
|:---|:---|:---|
|id|Integer(PK)|Unique ID|
|adventurer_id|Integer(FK)|Links to respective character|
|item_name|String|Name of the item or loot|