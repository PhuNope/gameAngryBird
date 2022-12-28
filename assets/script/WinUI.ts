import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {
    private callBack: CallableFunction | null = null;

    start() {

    }

    setUp(callBack:CallableFunction) {
        this.callBack = callBack;
    }

    onNextLevel() {
        //play audio

        this.node.destroy();
        this.callBack();
    }

    update(deltaTime: number) {
        
    }
}


