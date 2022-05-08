
class Game_Test extends Game_Interpreter {

    pluginCommand(command, args) {
        super(command, args);

        if (command === 'CardBattle') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_EnemyBook);
                break;
            case 'add':
                $gameSystem.addToEnemyBook(Number(args[1]));
                break;
            case 'remove':
                $gameSystem.removeFromEnemyBook(Number(args[1]));
                break;
            case 'complete':
                $gameSystem.completeEnemyBook();
                break;
            case 'clear':
                $gameSystem.clearEnemyBook();
                break;
            }
        }
    }

}