import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { LevelController } from './LevelController';
const { ccclass, property } = _decorator;

@ccclass('PigController')
export class PigController extends Component {
    private isDie: boolean = false;

    start() {
        let collider = this.node.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isDie) return;

        if (otherCollider.node.name == "ground" || otherCollider.node.name.includes("bird")) {
            this.isDie = true;

            let level = this.node.getParent();

            level.getComponent(LevelController).pigDie();
        }
    }

    update(deltaTime: number) {

    }
}


