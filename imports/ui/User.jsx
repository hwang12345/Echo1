import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import { Card, CardHeader, CardText } from 'material-ui/Card';

// icon
import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigateNext from 'material-ui/svg-icons/image/navigate-next';
import NavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import Looks1 from 'material-ui/svg-icons/image/looks-one';
import Looks2 from 'material-ui/svg-icons/image/looks-two';
import Looks3 from 'material-ui/svg-icons/image/looks-3';
import Looks4 from 'material-ui/svg-icons/image/looks-4';
import Looks5 from 'material-ui/svg-icons/image/looks-5';
import ModeEdit from "material-ui/svg-icons/editor/mode-edit";

// db
import { Users } from '../api/users.js';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            deleteOpen: false,
            userId: null,
            uid: null,
            password: null,
            username: null,
            originalUsername: null,
            group: null,
            usernameWarning: null,
            passwordWarning: null,
            confirmButton: false,
            snackBarOpen: false,
            snackBarInfo: '保存成功',
            addUser: false,
            skipPageNum: 0,
            currentPage: 0,
            beforeButton: true,
            nextButton: false,
            activeNum: 1,
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleChoose = this.handleChoose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSnackBarOpen = this.handleSnackBarOpen.bind(this);
        this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
        this.handleAddUser = this.handleAddUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        this.handleDeleteClose = this.handleDeleteClose.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    }

    /***
     * 将用户数据保存到 state ，便于在 dialog 中调用
     * update User && Dialog open
     * @param row
     * @param event
     */
    handleOpen(row, event) {
        this.setState({
            open: true,
            addUser: false,
            userId: row._id,
            uid: row.uid,
            username: row.username,
            originalUsername: row.username,
            group: row.group,
        });
    };

    handleClose() {
        this.setState({open: false});
    };

    handleConfirm() {
        this.setState({open: false});
        if(this.state.addUser) {
            Meteor.call("addUser", this.state.uid, this.state.username, this.state.password, this.state.group, Session.get("uid"),
                function (err, result) {
                    if (result) {
                        this.handleSnackBarOpen("添加成功！");
                    }  else {
                        this.handleSnackBarOpen("添加失败！请重试。");
                    }
                }.bind(this)
            );
        } else {
            Meteor.call("updateUser", this.state.uid, this.state.username, this.state.password, this.state.group, Session.get("uid"),
                function (err, result) {
                    if (result) {
                        this.handleSnackBarOpen("修改成功！");
                    } else {
                        this.handleSnackBarOpen("修改失败！请重试。");
                    }
            }.bind(this));
        }
    };

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });

        // 判断用户的输入内容是否满足最小限制，如满足则让登陆按钮可以点击
        if (name === 'username') {
            if (value.length < 4) {
                this.setState({
                    usernameWarning: '用户不能少于四位',
                    //confirmButton: true,
                });
            } else {
                this.setState({usernameWarning: ''});
            }
        } else {
            if (value.length >= 6 || value.length === 0) {
                this.setState({passwordWarning: ''});
            } else {
                this.setState({
                    passwordWarning: '密码不能少于六位',
                    // confirmButton: true,
                });
            }
        }
    }

    handleChoose(event, value) {
        if (value === 1) {
            this.setState({group: "User"});
        } else {
            this.setState({group: "Admin"});
        }
    }

    /***
     * 底部提示条
     * SnackBar
     * @param info
     */
    handleSnackBarOpen(info) {
        setTimeout(function() {
            this.setState({
                snackBarInfo: info,
                snackBarOpen: true,
            });
        }.bind(this), 500);
    }

    handleSnackBarClose() {
        this.setState({
            snackBarOpen: false,
        });
    }

    /***
     * 添加用户
     * Add user
     */
    handleAddUser() {
        this.setState({
            open: true,
            uid: parseInt(Users.find().fetch()[Users.find().fetch().length-1].uid) + 1, // 用户ID 每次自加 1
            username: '',
            originalUsername: '',
            group: 'User',
            addUser: true
        });
    }

    /***
     * 删除用户
     * Delete User
     */
    handleDeleteUser() {
        //this.setState({open: false});
        this.setState({
            open: false,
            deleteOpen: true
        });
    }

    handleDeleteClose() {
        this.setState({
            deleteOpen: false,
        });
    }

    handleDeleteConfirm() {
        this.setState({
            deleteOpen: false,
        });
        Meteor.call("deleteUser", this.state.uid, Session.get("uid"), function (err, result) {
            if (result) {
                this.handleSnackBarOpen("删除成功");
            } else {
                this.handleSnackBarOpen("删除失败！请重试");
            }
        }.bind(this))

    }

    /***
     * 分页功能相关方法
     * Pager
     */

    handlePageBefore() {
        if(this.state.skipPageNum > 0) {
            this.setState({
                skipPageNum: this.state.skipPageNum - 1,
                activeNum: this.state.activeNum - 1,
                beforeButton: true,
                nextButton: false,
            });
        } else {
            this.setState({
                beforeButton: true
            });
        }
    }

    handlePageNext() {
        if(parseInt(this.getDbCount()/10) > this.state.skipPageNum) {
            this.setState({
                skipPageNum: this.state.skipPageNum + 1,
                activeNum: this.state.activeNum + 1,
                beforeButton: false,
                nextButton: true,
            });
        } else {
            this.setState({
                nextButton: false
            });
        }
    }

    handlePageNumClicked(page, event) {
        this.setState({
            skipPageNum: page - 1,
            activeNum: page,
        });

        if (page === 1) {
            this.setState({
                beforeButton: true,
            });
        } else {
            this.setState({
                beforeButton: false,
            });
        }

        if (page === parseInt(this.getDbCount()/10 + 1)) {
            this.setState({
                nextButton: true,
            });
        } else {
            this.setState({
                nextButton: false,
            });
        }
    }

    // 异步，不能在render直接赋值,否则取不到内容
    getDbData() {
        return Users.find({},{skip:this.state.skipPageNum * 10, limit: 10});
    }

    getDbCount() {
        return Users.find().count();
    }

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="保存"
                primary={true}
                disabled={this.state.confirmButton}
                onTouchTap={this.handleConfirm}
            />,
        ];

        const modeifyActions = [
            <FlatButton
                label="删除"
                secondary={true}
                onTouchTap={this.handleDeleteUser}
            />,
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="保存"
                primary={true}
                disabled={this.state.confirmButton}
                onTouchTap={this.handleConfirm}
            />
        ];

        const deleteAction = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleDeleteClose}
            />,
            <FlatButton
                label="删除"
                secondary={true}
                onTouchTap={this.handleDeleteConfirm}
            />,
        ];

        return (
            <Card>
                <CardText>
                    <Table
                        selectable={false} // 可选
                        fixedHeader={false}
                        multiSelectable={false}
                    >
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                            enableSelectAll={false}
                        >
                            <TableRow>
                                <TableHeaderColumn>编号</TableHeaderColumn>
                                <TableHeaderColumn>用户 ID</TableHeaderColumn>
                                <TableHeaderColumn>用户名</TableHeaderColumn>
                                <TableHeaderColumn>群组</TableHeaderColumn>
                                <TableHeaderColumn>注册时间</TableHeaderColumn>
                                <TableHeaderColumn>操作</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            stripedRows={false} // 隔行高亮
                            showRowHover={true}
                            displayRowCheckbox={false}
                        >

                            {this.getDbData().map((data, index) => (
                                <TableRow key={index} selected={data.selected}>
                                    <TableRowColumn>{this.state.skipPageNum* 10 + index + 1}</TableRowColumn>
                                    <TableRowColumn>{data.uid}</TableRowColumn>
                                    <TableRowColumn>{data.username}</TableRowColumn>
                                    <TableRowColumn>{data.group}</TableRowColumn>
                                    <TableRowColumn>{data.regTime.toLocaleString('chinese', {hour12:false})}</TableRowColumn>
                                    <TableRowColumn>
                                        <IconButton onTouchTap={this.handleOpen.bind(this, data)}>
                                            <ModeEdit color="#00bcd4"/>
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>


                        <TableFooter
                            // adjustForCheckbox={false}
                        >
                            <TableRow>
                                <TableRowColumn/>
                                <TableRowColumn colSpan="4" style={{textAlign: 'center'}}>
                                    <IconButton
                                        onTouchTap={this.handlePageBefore.bind(this)}
                                        disabled={this.state.beforeButton}
                                    >
                                        <NavigateBefore color="#757575" hoverColor="#00bcd4"/>
                                    </IconButton>
                                    <IconButton
                                        onTouchTap={this.handlePageNumClicked.bind(this,1)}
                                    >
                                        <Looks1 color={this.state.activeNum === 1? "#00bcd4" : "#757575" } hoverColor="#00bcd4"/>
                                    </IconButton>
                                    <IconButton
                                        onTouchTap={this.handlePageNumClicked.bind(this,2)}
                                    >
                                        <Looks2 color={this.state.activeNum === 2? "#00bcd4" : "#757575" } hoverColor="#00bcd4"/>
                                    </IconButton>
                                    {/*<IconButton><Looks3 color="#757575" hoverColor="#00bcd4"/></IconButton>*/}
                                    {/*<IconButton><Looks4 color="#757575" hoverColor="#00bcd4"/></IconButton>*/}
                                    {/*<IconButton><Looks5 color="#757575" hoverColor="#00bcd4"/></IconButton>*/}
                                    <IconButton
                                        onTouchTap={this.handlePageNext.bind(this)}
                                        disabled={this.state.nextButton}
                                    >
                                        <NavigateNext color="#757575" hoverColor="#00bcd4"/>
                                    </IconButton>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <IconButton onTouchTap={this.handleAddUser}><ContentAdd color="#ff4081"/></IconButton>
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <Dialog
                        title={this.state.addUser ? "新增用户" : "修改用户信息"}
                        actions={this.state.addUser ? actions : modeifyActions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                    >
                        <TextField
                            disabled={true}
                            defaultValue={this.state.uid}
                            floatingLabelText="用户 ID (系统自动生成，不可修改)"
                            fullWidth
                        /><br />
                        <TextField
                            name="username"
                            defaultValue={this.state.username}
                            floatingLabelText="用户名"
                            onChange={this.handleChange}
                            errorText={this.state.usernameWarning}
                            fullWidth
                        /><br />
                        <SelectField
                            floatingLabelText="群组"
                            value={this.state.group}
                            onChange={this.handleChoose}
                            fullWidth
                        >
                            <MenuItem value="Admin" primaryText="Admin" />
                            <MenuItem value="User" primaryText="User" />
                        </SelectField><br />
                        <TextField
                            name="password"
                            type="password"
                            floatingLabelText={!this.state.addUser ? "修改密码(留空为不修改)" : "密码"}
                            onChange={this.handleChange}
                            errorText={this.state.passwordWarning}
                            fullWidth
                        /><br />
                    </Dialog>
                    <Dialog
                        actions={deleteAction}
                        modal={false}
                        open={this.state.deleteOpen}
                        onRequestClose={this.handleDeleteClose}
                    >
                        确定删除用户<strong style={{color: "#ff4081"}}> {this.state.username}</strong> ? 此操作不可逆！！！
                    </Dialog>
                    <Snackbar
                        open={this.state.snackBarOpen}
                        message={this.state.snackBarInfo}
                        autoHideDuration={2000}
                        onRequestClose={this.handleSnackBarClose}
                    />
                </CardText>
            </Card>
        );

    }
}

User.propTypes = {
    users: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        users: Users.find().fetch(),
    };
}, User);