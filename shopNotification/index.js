const sound = require("sound-play");
const path = require("path");
const filePath = path.join(__dirname, "file.mp3");

module.exports = {
  defaultConfig: {
    enabled: true,
	mystical: true,
	legendary: true,
	ld: true,
	sstones: true,
	heroSixRune: true,
	legendSixRune: true,
  },
    defaultConfigDetails: {
    mystical: { label: 'Mystical Scrolls' },
    legendary: { label: 'Legendary Scroll Pieces' },
	ld: { label: 'Light&Darkness Scroll Pieces' },
	sstones: { label: 'Summoning Stones' },
	heroSixRune: { label: '6* Hero Runes'},
	legendSixRune: { label: '6* Legend Runes'},
  },
  pluginName: 'Shop Notification',
  pluginDescription: 'Provides a notifaction whenever some important item is in shop.',
  init(proxy) {
    proxy.on('apiCommand', (req, resp) => {
      if (config.Config.Plugins[this.pluginName].enabled) {
        this.processCommand(proxy, req, resp);
      }
    });
  },
  
  processCommand(proxy, req, resp) {
    const { command } = req;
    let runesInfo = [];

    // Extract the rune and display it's efficiency stats.
    switch (command) {
	
	// item.item_master_type === 9 -> summoning stuff
	// item.item_master_id 
	// 2 -> Mystical scrolls, 
	// 8 -> Summoning Stones
	// 9 -> legendary pieces
	// 10 -> ld pieces
	
	// runes[5] = grade (1 - 5) , runes[6] = stars (1 - 6)
	
	case 'GetBlackMarketList':
        resp.market_list.forEach((item) => {
		
		// Mystical Scroll
		if (config.Config.Plugins[this.pluginName].mystical && ( item.item_master_type === 9 && item.item_master_id === 2)) {
			sound.play(filePath);
		}			
		
		// Legendary Scroll Pieces
        else if (config.Config.Plugins[this.pluginName].legendary && ( item.item_master_type === 9 && item.item_master_id === 9)) {
			sound.play(filePath);
		}
		
		// Summoning Stones
		else if (config.Config.Plugins[this.pluginName].sstones && ( item.item_master_type === 9 && item.item_master_id === 8)) {
			sound.play(filePath);
		}
		
		// LD Scroll Pieces
		else if (config.Config.Plugins[this.pluginName].ld && ( item.item_master_type === 9 && item.item_master_id === 10)) {
			sound.play(filePath);
		}
        
		else if (item.item_master_type === 8 && item.runes) {
			
			// Hero runes 6*
			if (config.Config.Plugins[this.pluginName].heroSixRune && (item.runes[0]["rank"] === 4 && item.runes[0]["class"] === 6)) {
				sound.play(filePath);
			}
		
			// Legend runes 6*
			else if (config.Config.Plugins[this.pluginName].legendSixRune && (item.runes[0]["rank"] === 5 && item.runes[0]["class"] === 6)) {
				sound.play(filePath);
			}
		}
		});
        break;
		
	}
  },
};