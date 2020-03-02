import React from 'react';
import * as PIXI from 'pixi.js';

const getPlanetPos = function(radius, phase) {
    return new PIXI.Point(
        // these magic numbers come from this.orbitCenter
        radius * Math.cos(-phase) + 600,
        radius * Math.sin(-phase) + 460);
};

export default class ZodiacStrip extends React.Component {
    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        this.targetPlanetLongitude = 0;
        this.sunLongitude = 0;
    }

    render() {
        return (
            <div className="ZodiacStrip"
                ref={(thisDiv) => {this.el = thisDiv;}} />
        );
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            width: 600,
            height: 197,
            backgroundColor: 0x231f20,
            antialias: true,
        });

        this.el.appendChild(this.app.view);

        const me = this;
        const stage = new PIXI.Container();
        this.app.stage.addChild(stage);

        const zodiacStrip = new PIXI.Sprite(
	    PIXI.Texture.from('img/zodiac-strip.jpg')
        );

        zodiacStrip.y += 50;
        stage.addChild(zodiacStrip);

        me.targetPlanetZodiacContainer = me.drawTargetPlanetZodiac();
        me.sunZodiacContainer = me.drawSunZodiac();

        me.directLine = me.drawLine();
        me.wrapAroundLine = me.drawLine();

        me.text = me.drawText();
        me.zodiacText = me.drawZodiac();

        me.start();
    }

    drawLine() {
        const g = new PIXI.Graphics();
        g.visible = false;

        g.clear();
        g.lineStyle(2, 0x00FFD2);
        g.beginFill(0xffe200, 0.7);

        this.app.stage.addChild(g);
        return g;
    }

    drawText() {
        const angleText = new PIXI.Text('Angle', {
            fontFamily: 'Garamond',
            fontSize: 42,
            fill: 0x39696,
        });

        angleText.anchor.set(0.5);
        angleText.position.x = 300;
        angleText.position.y = 175;
        this.app.stage.addChild(angleText);

        return angleText;
    }

    drawZodiac() {
        const zodiacText = new PIXI.Text('Zodiac Strip with Constellations', {
            fontFamily: 'Garamond',
            fontSize: 36,
            // fontWeight: 'bold',
            fill: 0x39696, //0xffff80,
        });

        // angleText.rotation = degToRad(-90);
        zodiacText.anchor.set(0.5);
        zodiacText.position.x = 300;
        zodiacText.position.y = 25;
        this.app.stage.addChild(zodiacText);

        return zodiacText;
    }
    drawSunZodiac() {

        const sunZodiacContainer = new PIXI.Container();
        sunZodiacContainer.name = 'sunZodiac';
        sunZodiacContainer.position = new PIXI.Point(600 / 4, 48.5 + 50);

        const sunZodiac = new PIXI.Sprite(PIXI.Texture.from('img/yellow_circle.png'));
        sunZodiac.anchor.set(0.5);
        sunZodiac.width = 40;
        sunZodiac.height = 40;
        sunZodiacContainer.addChild(sunZodiac);

        this.app.stage.addChild(sunZodiacContainer);

        return sunZodiacContainer;

    }
    drawTargetPlanetZodiac() {

        const targetPlanetContainer = new PIXI.Container();
        targetPlanetContainer.name = 'targetPlanetZodiac';
        targetPlanetContainer.position = new PIXI.Point(3 * 600 / 4, 48.5 + 50);

        const targetPlanetImage = new PIXI.Sprite(PIXI.Texture.from('img/grey_circle.png'));
        targetPlanetImage.anchor.set(0.5);
        targetPlanetImage.width = 30;
        targetPlanetImage.height = 30;
        targetPlanetContainer.addChild(targetPlanetImage);


        this.app.stage.addChild(targetPlanetContainer);

        return targetPlanetContainer;
    }
    componentWillUnmount() {
        this.app.stop();
    }
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }
    stop() {
        cancelAnimationFrame(this.frameId);
    }
    getElongationAngle() {

        let observerPos = getPlanetPos(this.props.radiusObserverPlanet, this.props.observerPlanetAngle);
        let targetPos = getPlanetPos(this.props.radiusTargetPlanet, this.props.targetPlanetAngle);
        let sunPos = new PIXI.Point(0, 0);

        observerPos.x -= 600;
        observerPos.y -= 460;

        observerPos.y *= -1;

        targetPos.x -= 600;
        targetPos.y -= 460;

        targetPos.y *= -1;
        this.updateZIndex(observerPos, targetPos);

        let targetPlanetAngle = Math.atan2(targetPos.y - observerPos.y, targetPos.x - observerPos.x);
        let sunAngle = Math.atan2(sunPos.y - observerPos.y, sunPos.x - observerPos.x);

        let r = targetPlanetAngle * 180 / Math.PI;
        let p = sunAngle * 180 / Math.PI;

        this.targetPlanetLongitude = targetPlanetAngle;
        this.sunLongitude = sunAngle;

        // console.log('I AM DOOM', targetPlanetAngle, sunAngle);
        this.props.updateAngles(targetPlanetAngle, sunAngle);

        if (-Math.PI < sunAngle && sunAngle < 0) {
            sunAngle += 2 * Math.PI;
        }

        if (-Math.PI < targetPlanetAngle && targetPlanetAngle < 0) {
            targetPlanetAngle += 2 * Math.PI;
        }

        let elongationAngle = targetPlanetAngle - sunAngle;

        if (elongationAngle < 0) {
            elongationAngle += 2 * Math.PI;
        }

        return elongationAngle;
    }
    getDistance(targetPos, observerPos) {
        let diffX = Math.pow((targetPos.x - observerPos.x), 2);
        let diffY = Math.pow((targetPos.y - observerPos.y), 2);

        return Math.pow((diffX + diffY), 0.5);
    }

    updateLine(elongationAngle) {
        this.wrapAroundLine.clear();
        this.directLine.clear();

        this.directLine.moveTo(this.sunZodiacContainer.x, this.sunZodiacContainer.y);
        this.directLine.visible = true;
        this.directLine.lineStyle(2, 0x00f2ff);
        this.directLine.beginFill(0x00f2ff, 0.7);

        this.wrapAroundLine.visible = false;
        this.wrapAroundLine.lineStyle(2, 0x00f2ff);
        this.wrapAroundLine.beginFill(0x00f2ff, 0.7);

        let targetX = this.targetPlanetZodiacContainer.x;
        let sunX = this.sunZodiacContainer.x;

        if (elongationAngle >= 180) {
            if (sunX < targetX) {
                this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y);
            } else if (sunX > targetX) {
                this.wrapAroundLine.visible = true;
                this.directLine.lineTo(600, this.targetPlanetZodiacContainer.y);
                this.wrapAroundLine.moveTo(0, this.sunZodiacContainer.y);
                this.wrapAroundLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y);
            }
        } else if (elongationAngle < 180) {
            if (sunX > targetX) {
                this.directLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y);
            } else if (sunX < targetX) {
                this.wrapAroundLine.visible = true;
                this.directLine.lineTo(0, this.targetPlanetZodiacContainer.y);
                this.wrapAroundLine.moveTo(600, this.sunZodiacContainer.y);
                this.wrapAroundLine.lineTo(this.targetPlanetZodiacContainer.x, this.targetPlanetZodiacContainer.y);
            }
        }
    }
    updateText(newAngle) {
        this.text.text = newAngle;
    }
    updateZodiacBodyPos(longitude, body, width) {
     	let angle = longitude / (2 * Math.PI);

        if (longitude >= -Math.PI && longitude < 0) {
            angle = longitude + (2 * Math.PI);
            angle /= (2 * Math.PI);
        }

        if (angle > 0.75 && angle < 1.0) {
            angle -= 1;
        }

        angle *= -1;
        body.x = 450 + (angle * (600 + width));
    }
    updateZIndex(observer, target) {

        if (this.props.radiusObserverPlanet < this.props.radiusTargetPlanet) {
            this.app.stage.setChildIndex(this.sunZodiacContainer, 2);
            this.app.stage.setChildIndex(this.targetPlanetZodiacContainer, 1);

            return;
        }

        let distObsTarget = this.getDistance(observer, target);
        let distObsSun = this.getDistance(observer, new PIXI.Point(0, 0));

        if (distObsTarget > distObsSun) {
            this.app.stage.setChildIndex(this.sunZodiacContainer, 2);
            this.app.stage.setChildIndex(this.targetPlanetZodiacContainer, 1);
        } else {
            this.app.stage.setChildIndex(this.sunZodiacContainer, 1);
            this.app.stage.setChildIndex(this.targetPlanetZodiacContainer, 2);
        }
    }

    getDistance(firstBody, secondBody) {
        let diffX = Math.pow(firstBody.x - secondBody.x, 2);
        let diffY = Math.pow(firstBody.y - secondBody.y, 2);

        return Math.pow((diffX + diffY), 0.5);
    }

    animate() {
        let elongationAngle = this.getElongationAngle();

        // The 0s are for the width value of the body
        this.updateZodiacBodyPos(this.sunLongitude, this.sunZodiacContainer, 0); // should be 20
        this.updateZodiacBodyPos(this.targetPlanetLongitude, this.targetPlanetZodiacContainer, 0); // should be 15

        let num = elongationAngle * 180 / Math.PI;
        this.updateLine(num);

        let direction = '° E ';
        if (num > 180) {
            let temp = num - 180;
            num -= temp * 2;
            direction = '° W ';
        }

        if (num == 0 || num == 180) {
            direction = '° ';
        }

        let textNum = String(" " + num.toFixed(2)).slice(-6);
        textNum += direction;

        this.updateText(textNum);

    	this.frameId = requestAnimationFrame(this.animate);

    }
}

// ZodiacStrip.propTypes = {
//     deltaAngle: Proptypes.number.isRequired,
//     getElongationAngle: Proptypes.func.isRequired
// };
