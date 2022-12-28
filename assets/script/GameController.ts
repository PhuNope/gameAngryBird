import { _decorator, Camera, Component, ERigidBody2DType, EventTouch, Graphics, Input, input, instantiate, Node, Prefab, resources, RigidBody2D, Vec2, Vec3 } from 'cc';
import { LevelController } from './LevelController';
import { WinUI } from './WinUI';
import { AudioController } from './AudioController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    private gameLevel: number = 1;
    private currentLevelNode: Node | null = null;
    private bird: Node | null = null;
    private birdPrefab: Prefab | null = null;

    @property(Node)
    private ui_draw: Node | null = null;
    private graphic: Graphics | null = null;

    @property(Camera)
    private camera: Camera | null = null;

    private birdPositon: Vec3 | null = new Vec3(-450, -100, 0);

    private firstPoint: Vec3 = new Vec3(190, 260);
    private pullVector: Vec3 | null = null;

    private winUIPrefab: Prefab | null = null;

    async start() {
        this.graphic = this.ui_draw.getComponent(Graphics);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        await this.setUpLevel();
    }

    private onTouchStart() { }

    private onTouchMove(event: EventTouch) {
        this.graphic.clear();

        //diem xuat phat
        this.graphic.moveTo(this.firstPoint.x, this.firstPoint.y);

        //doi vi tri camera sang vi tri that tren man hinh
        let lastPoint = this.camera.screenToWorld(new Vec3(event.getLocation().x, event.getLocation().y, 0));

        //ve
        this.graphic.lineTo(lastPoint.x, lastPoint.y);
        this.graphic.stroke();
        //pull vector
        this.pullVector = lastPoint.subtract(this.firstPoint);
    }

    private onTouchEnd(event: EventTouch) {
        this.graphic.clear();
        //ban chym
        if (this.pullVector && this.bird) {
            //bird
            let birdRiggid: RigidBody2D = this.bird.getChildByName("birdSprite").getComponent(RigidBody2D);
            birdRiggid.type = ERigidBody2DType.Dynamic;

            //play sound and shoot bird
            setTimeout(() => {
                //sound
                AudioController.instance.playsound(2);
                //shoot bird
                birdRiggid.applyForce(new Vec2(this.pullVector.x, this.pullVector.y).multiply(new Vec2(-20, -20)), Vec2.ZERO, true);
            }, 100);
        }
    }

    //custom set prefab
    private loadPrefab(path: string, callback: CallableFunction) {
        resources.load(path, (error, prefab: Prefab) => {
            if (callback) {
                callback(prefab);
            }
        })
    }

    private setUpLevel() {
        let levelPathStr = "gamelevel/Level" + this.gameLevel;

        this.loadPrefab(levelPathStr, (prefab: Prefab) => {
            this.currentLevelNode = instantiate(prefab);
            this.currentLevelNode.getComponent(LevelController).setUp(() => {
                setTimeout(() => {
                    this.showWinUI();
                }, 1000);
            })

            this.node.addChild(this.currentLevelNode);
        })

        //create bird
        const createBird = (prefab: Prefab) => {
            this.bird = instantiate(prefab);
            this.bird.setPosition(this.birdPositon);
            this.node.addChild(this.bird);
        }

        if (this.birdPrefab == null) {
            this.loadPrefab("bird/birdPre", (prefab: Prefab) => {
                this.birdPrefab = prefab;
                createBird(prefab);
            })
        } else {
            createBird(this.birdPrefab);
        }
    }

    private showWinUI() {
        //play sound
        AudioController.instance.playsound(1);
        //load prefab win ui
        const createUI = (prefab: Prefab) => {
            let winUI = instantiate(prefab);
            winUI.getComponent(WinUI).setUp(() => {
                this.nextLevel();
            })

            this.node.addChild(winUI);
        }

        if (this.winUIPrefab == null) {
            this.loadPrefab("ui/winUI", (prefab: Prefab) => {
                this.winUIPrefab = prefab;
                createUI(prefab);
            });
        } else {
            createUI(this.winUIPrefab);
        }
    }

    private nextLevel() {
        this.currentLevelNode.destroy();
        this.currentLevelNode = null;

        this.bird.destroy();
        this.bird = null;

        if (this.gameLevel == 3) {
            this.gameLevel = 1;
        } else this.gameLevel++;

        setTimeout(() => {
            this.setUpLevel();
        }, 1000);
    }
}


