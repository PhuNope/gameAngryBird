import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    private gameLevel: number = 1;
    private currentLevelNode: Node | null = null;
    private bird: Node | null = null;
    private birdPrefab: Prefab | null = null;

    @property(Node)
    private ui_draw: Node | null = null;

    start() {

    }

    update(deltaTime: number) {

    }
}


