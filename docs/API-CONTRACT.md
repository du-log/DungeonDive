# Routes
- /adventurer
- /user
- /dungeon

## /adventurer
#### /roster
Accesses the database based on a specified user ID, then returns a JSON based on a dictionary that returns the full list of adventurers associated with the user.
#### /recruit
Accesses the database based on a specified user ID. Attempts to insert a new adventurer depending on if the associated user has a specified amount of gold, and if successful updates the new gold amount of user and adds new adventurer to the roster.
#### /retire/{adv_id}
Using a passed-in adventurer ID, attempts to remove specified adventurer from the database. First checks if adventurer is associated with the user, then determines a refunded gold amount based on the adventurer's level * 100. If all successful, adventurer is deleted from the database and gold is refunded by updating the 'gold' amount of the user.

## /user
#### /info
Accesses the database based on the user ID and returns a JSON consisting of the user's username and gold amount.
#### /add-gold
Temporary endpoint that updates the user's gold amount by +100, will be removed at a later date.

## /dungeon
#### /tick
Takes in a Content Request of a list of party IDs. Every tick does a randomized roll between 1 and 100, and specified events are initiated based on the integer rolled. Current events completed are LOOT and COMBAT.
- LOOT provides a random amount of gold and updates the user's gold amount based on the random integer.
- COMBAT will delete a random amount of HP from each adventurer in the party. Currently not implemented, will just return a message.