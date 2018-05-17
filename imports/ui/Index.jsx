import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            finished: false,
            stepIndex: 0,
        });
    }

    handleNext() {
        this.setState({
            stepIndex: this.state.stepIndex + 1,
            finished: this.state.stepIndex >= 2,
        });
    };

    handlePrev() {
        if (this.state.stepIndex > 0) {
            this.setState({stepIndex: this.state.stepIndex - 1});
        }
    };

    renderStepActions(step) {
        return (
            <div style={{margin: '12px 0'}}>
                <RaisedButton
                    label={this.state.stepIndex === 2 ? '完成' : '下一步'}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    onTouchTap={this.handleNext.bind(this)}
                    style={{marginRight: 12}}
                />
                {step > 0 && (
                    <FlatButton
                        label="上一步"
                        disabled={this.state.stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onTouchTap={this.handlePrev.bind(this)}
                    />
                )}
            </div>
        );
    }

    render() {
        return (
            <Card>
                <br />
                <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto', fontSize: 20}}>
                    <p>你好！<span style={{color: "#00bcd4"}}>{Session.get("username")}</span></p>
                    <p style={{fontSize: 15}}>欢迎使用本系统！</p>
                </div>
                <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
                    <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                        <Step>
                            <StepLabel>进入 活动轨迹监测</StepLabel>
                            <StepContent>
                                <p>
                                    点击左上角的汉堡菜单即可打开，再次点击即可关闭。<br />
                                    展开后选择  活动轨迹监测
                                </p>
                                {this.renderStepActions(0)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>查看旅客列表</StepLabel>
                            <StepContent>
                                <p>进入活动轨迹监测界面即可看到当前的旅客列表。</p>
                                <p>可展示的信息有网卡地址，进入时间，最后出现时间</p>
                                {this.renderStepActions(1)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>绘制用户轨迹</StepLabel>
                            <StepContent>
                                <p>
                                    点击绘制列的笔型ICON，即可绘制旅客的轨迹。点击取消绘制列的叉型ICON，即可删除已绘制的轨迹。
                                </p>
                                {this.renderStepActions(2)}
                            </StepContent>
                        </Step>
                    </Stepper>
                    {this.state.finished && (
                        <p style={{margin: '20px 0', textAlign: 'center'}}>
                            <a
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({stepIndex: 0, finished: false});
                                }}
                            >
                                点击这里
                            </a> 从头观看教程.
                        </p>
                    )}
                </div>
                <br />
            </Card>
        );

    }
}