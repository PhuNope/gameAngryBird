import { _decorator, AudioClip, AudioSource, Component, game, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController | null = null;
    @property(AudioClip)
    private gameAudios: AudioClip[] = [];
    @property(AudioSource)
    audioSource: AudioSource | null = null;

    start() {
        if (AudioController.instance == null) {
            game.addPersistRootNode(this.node);
            AudioController.instance = this;
        }
    }

    playsound(index: number) {
        //check audio on
        this.audioSource?.playOneShot(this.gameAudios[index], 1.0);
    }
}


