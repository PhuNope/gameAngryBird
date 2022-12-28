import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    private winCallBack: CallableFunction | null = null;

    start() {

    }

    setUp(callBack: CallableFunction) {
        this.winCallBack = callBack;
    }

    public pigDie() {
        this.winCallBack();
    }
}


