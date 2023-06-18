const idToTypeMap = {
    medicine: 'skill'
}

const idToAbilityMap = {
    medicine: 'wis'
}

class ProficiencyLearningData {
    current = 0;

    constructor(type, name, ability, goal) {
        this.type = type;
        this.name = name;
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


    static startLearning(actor, proficiencyId) {
        const proficiencyInfo = this.#determineProficienyInfosFromId(proficiencyId);
        actor.setFlag(
            this.ID, 
            'learning',
            new ProficiencyLearningData(
                proficiencyInfo.type,
                proficiencyId,
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

