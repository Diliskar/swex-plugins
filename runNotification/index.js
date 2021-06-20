const sound = require("sound-play");
const path = require("path");
const filePath = path.join(__dirname, "file.mp3");

module.exports = {
  defaultConfig: {
    enabled: true,
	cairos: true,
	scenarios: true,
	raid: true,
	beasts: true,
	dhole: true,
  },
    defaultConfigDetails: {
		cairos: { label: 'Cairos Dungeons' },
		scenarios: { label: 'Scenarios' },
		raid: { label: 'Raid' },
		beasts: { label: 'Rift beasts' },
		dhole: { label: 'Dimensional Hole' },
  },
  pluginName: 'Run Notification',
  pluginDescription: 'Provides a notifcation when a repeat battle ends, either by 10/10 runs or defeat.',
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
    let sound = false;

	if (
        (command === 'BattleScenarioResult' && config.Config.Plugins[this.pluginName].scenarios) ||
        (command === 'BattleDungeonResult' && config.Config.Plugins[this.pluginName].cairos) ||
        (command === 'BattleDungeonResult_V2' && config.Config.Plugins[this.pluginName].cairos) ||
        (command === 'BattleDimensionHoleDungeonResult_v2' && config.Config.Plugins[this.pluginName].dhole) ||
			  (command === 'BattleRiftOfWorldsRaidResult' && config.Config.Plugins[this.pluginName].raid) ||
			  (command === 'BattleRiftDungeonResult' && config.Config.Plugins[this.pluginName].beasts)
      )
	{

    // Check if 10/10 runs done
		if (req["auto_repeat"] == 10) {
			sound.play(filePath);
      sound = true;
		}

    // Check for lose, except rift beasts
		else if (req["win_lose"] != 1 && command !== "BattleRiftDungeonResult") {
			sound.play(filePath);
      sound = true;
		}

    // Check for max level in scenarios (excludes 6* mons due to farmer)
    // TODO: check for 6* implementation
    else if (command === "BattleScenarioResult") {

      var units = resp["unit_list"]
      var max = false;
      var levels = [15, 20, 25, 30, 35];

      for (let i = 0; i < units.length; i++) {
        if (units[i]["class"] != 6) {
          var classNR = units[i]["class"];
          proxy.log({type: 'info', source: 'plugin',name: this.pluginName, message:'Test1'});
          proxy.log({type: 'info', source: 'plugin',name: this.pluginName, message:'Class:' + units[i]["class"] + ' Level: ' + units[i]["unit_level"] + " Levels:" + levels[classNR-1]});
          if (units[i]["unit_level"] === levels[classNR-1]) {
            max = true;
          }
        }
      }

      if (max) {
        sound.play(filePath);
        sound = true;
      }

    }

    // Check for low energy_max
    // Implementation for Cairos B8-B12, all scenarios
    // Implementation for Rift beasts / essence halls b 5 - b 10
    if (!sound && resp["wizard_info"]["wizard_energy"] <= 10 && command != 'BattleRiftOfWorldsRaidResult' && command != 'BattleDimensionHoleDungeonResult_v2') {

      let currentEnergy = resp["wizard_info"]["wizard_energy"];


      // Cairos Dungeons
      if (command === 'BattleDungeonResult_V2' && config.Config.Plugins[this.pluginName].cairos) {
          let elemental = [1001, 2001, 3001, 4001, 5001, 7001];
          let runeArtifacts = [6001, 8001, 9001, 9501, 9502];

          if (elemental.includes(req["dungeon_id"])) {
              if (req["stage_id"] >= 5 && req["stage"] <= 7) {
                this.checkEnergy(currentEnergy, 6);
              }
              else if (req["stage_id"] > 7) {
                this.checkEnergy(currentEnergy, 7);
              }
          }

          else if (runeArtifacts.includes(req["dungeon_id"])) {
              if (req["stage_id"] >= 8 && req["stage_id"] <= 11 ) {
                this.checkEnergy(currentEnergy, 8);
              }
              else if (req["stage_id"] === 12) {
                this.checkEnergy(currentEnergy, 9);
              }
        }
      }

      // Rift Beasts
      else if (command === 'BattleRiftDungeonResult' && config.Config.Plugins[this.pluginName].beasts) {
          let beasts = [1001, 2001, 3001, 4001, 5001];

          if (beasts.includes(req["dungeon_id"])) {
            this.checkEnergy(currentEnergy, 8);
          }
      }

      // Scenarios
      else if (command === 'BattleScenarioResult') {
        let info = resp["scenario_info"];

        if (info["difficulty"] === 1) {
            if (info["stage_no"] < 7) {
                this.checkEnergy(currentEnergy, 3);
            } else {
              this.checkEnergy(currentEnergy, 4);
            }
        }
        else if (info["difficulty"] === 2) {
          if (info["stage_no"] < 7) {
              checkEnergy(currentEnergy, 4);
          } else {
            this.checkEnergy(currentEnergy, 5);
          }
        }
        else if (info["difficulty"] === 3) {
          if (info["stage_no"] < 7) {
              this.checkEnergy(currentEnergy, 5);
          } else {
            this.checkEnergy(currentEnergy, 6);
          }
        }
      }
    }
	}
},

  checkEnergy(current, needed) {

    if (needed > current) {
      sound.play(filePath);
    }

  },
};
