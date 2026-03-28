# Dungeon Dive
A browser-based management game that incorporates auto-battling/idle game elements with RPG elements.  
This isn't complete by any means, but for now some things work, at least.
# 
I primarily started this just to learn React, and what better way than to make a basic browser-based game? Honestly, it'll just be a project made out of love, but I intend to host it as a free game one day with a non-localized data source.  
For what works at the moment (3/28):
- There is some sort of auto-tick for the "dungeon". This requires having at least one party member to enable it, then every 3 seconds it'll call an endpoint that leads to a random event.
- The party system works, or at least a very basic form of it.  
- You can also recruit and retire adventurers. Right now, there's no benefit since I haven't implemented the experience gain and leveling, but you can recruit as many as you want. I intend to cap that at some point.
# 
Current plan for the near future:  
- I'm in the process of implementing a battle system. This will involve having a separate party, and I'll relegate the current tick system as a passive way of generating income. It'll be a mix of something like Epic Seven with its speed-based combat, and Granblue Fantasy with how it handles buff/debuff/nuking skills and limit bursts.
- There are still things I'll need to do afterwards, like adding the leveling and stats/skills system, UI tweaking, etcetera. Unfortunately, I don't have funds due to the lack of a job, so I can't pay for sprites or anything of the sort. We'll have to make do with simple Tailwind+DaisyUI windows and Lucide icons for now.
