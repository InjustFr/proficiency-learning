const idToTypeMap = {
    medicine: 'skill'
}

const idToAbilityMap = {
    medicine: 'wis'
}

class ProficiencyLearningData {
    current = 0;

    constructor(id, type, ability, goal) {
        this.id = id;
        this.type = type;
        this.ability = ability;
        this.goal = goal;
    }
}

class ProficiencyLearningModule {
    static ID = 'proficiency-learning';

    static settings = {
        defaultGoal: 75
    }

    static #determineProficienyInfosFromId(id) {
        const infos = {
            type: idToTypeMap[id],
            ability: idToAbilityMap[id]
        }

        if(infos.type === undefined) {
            infos.type = 'language';
            infos.ability = 'int';
        }

        return infos;
    }

    static init() {
    }

    static async injectProficiencyLearningView(app, html, data) {
        const proficiency = app.actor.getFlag(this.ID, 'learning');

        if(proficiency.type === 'skill')
            proficiency.name = CONFIG.DND5E.skills[proficiency.id].label;
        if(proficiency.type === 'language')
            proficiency.name = CONFIG.DND5E.skills[proficiency.id];

        const renderedTemplate = await renderTemplate(`modules/${this.ID}/templates/proficiency-learning.hbs`, {
            proficiency
        });

        $(html).find('.tab.attributes .center-pane').append(renderedTemplate);
    }


    static startLearning(actor, proficiencyId) {
        const proficiencyInfo = this.#determineProficienyInfosFromId(proficiencyId);
        actor.setFlag(
            this.ID, 
            'learning',
            new ProficiencyLearningData(
                proficiencyId,
                proficiencyInfo.type,
                proficiencyInfo.ability,
                proficiencyInfo.type === 'skill' ? this.settings.defaultGoal * 2 : this.settings.defaultGoal
            )
        )
    }

    static progress(actor) {
        const proficiency = actor.getFlag(this.ID, 'learning');

        setProperty(proficiency, 'current', proficiency.current + 2);

        if(proficiency.current >= proficiency.goal) {
            this.complete(actor, proficiency)
        }

    }

    static complete(actor, proficiency) {}
}

Hooks.once("init", async function () {
    ProficiencyLearningModule.init();
});

Hooks.on('renderActorSheet5e', async (app, html, data) => {
    ProficiencyLearningModule.injectProficiencyLearningView(app, html, data);
});

