import * as Constants from "../app/common/constants";
import { REST_API_URLS, AppConstants } from "../app/common/api-urls";
import { TeamProfileAction } from "./team-profile.widgets";
import { TournamentProfileAction, TOURNAMENTPROFILEWIDGETS } from "./tournament-profile.widgets";
export const STATICWIDGETS = {};

export const UserProfileAction = {
    "title": "showUser",
    "type": "rest",
    "method": "get",
    "url": "",
    "dev_url": "http://gsaserver.technideus.com/public/userList",
    "parameters": [
        {
            "id": "userId",
            "isMendatory": true,
            "source": "route",
            "sourceValue": "userId"
        },
        {
            "id": "requireAccessDetails",
            "isMendatory": true,
            "default": true,
        },
    ],
    "transformationType": "RAW"
}

export const ViewBracketAction = {
    "title": "viewBracket",
    "type": "rest",
    "method": "get",
    "url": "",
    "dev_url": REST_API_URLS.VIEW_BRACKET,
    "parameters": [
        {
            "id": "tournamentId",
            "isMendatory": true,
            source: "route",
        },
        {
            "id": "bracketId",
            "isMendatory": true,
            source: "route",
        },
    ],
    "transformationType": "RAW"
}

export const PrintBracketAction = {
    "title": "viewBracket",
    "type": "rest",
    "method": "get",
    "url": "",
    "dev_url": REST_API_URLS.PRINT_BRACKET,
    "parameters": [
        {
            "id": "tournamentId",
            "isMendatory": true,
            source: "route",
        },
        {
            "id": "bracketId",
            "isMendatory": true,
            source: "route",
        },
    ],
    "transformationType": "RAW"
}


export const SiteLoadAction = {
    "title": "load site globals",
    "type": "rest",
    "method": "get",
    "url": "",
    "dev_url": REST_API_URLS.LOAD_SITE_GLOBALS,
    "transformationType": "RAW",
    "parameters": [
        {
            "id": "domain",
            "isMendatory": true,
            "source": "system",
            "isSystem": true,
        },
    ],
}

STATICWIDGETS["PLAINTABLE"] = {
    name: "richTable",
    title: "Plain Table",
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true,
    }
}

STATICWIDGETS["LOGIN"] = {
    name: "form",
    title: "Login",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Sign In",
                fields: [
                    {
                        id: "username",
                        title: "User name",
                        type: "text",
                        required: true,
                    },
                    {
                        id: "password",
                        title: "Password",
                        type: "password",
                        required: true,
                    },
                    {
                        id: "login_with_otp",
                        title: "Login with OTP",
                        type: "checkbox",
                        dependencyInfo: [
                            {
                                fieldId: "password",
                                type: "enableDisable",
                                enableOn: [false],
                            },
                            {
                                fieldId: "phone_desc",
                                type: "showHide",
                                displayOn: [true],
                            },
                            {
                                fieldId: "otp_action",
                                type: "showHide",
                                displayOn: [true],
                            },
                            {
                                fieldId: "otp_input",
                                type: "showHide",
                                displayOn: [true],
                            },
                        ]
                    },
                    {
                        id: "phone_desc",
                        text: "OTP is send to your register primary contact no",
                        type: "plainText",
                        hidden: true,
                    },
                    {
                        id: "otp_input",
                        title: "Enter OTP",
                        type: "text",
                        hidden: true,
                        customClass: "row-item-primary",
                        required: true,
                    },
                    {
                        id: "otp_action",
                        title: "Resend OTP",
                        type: "button",
                        hidden: true,
                        action: {
                            name: "resend_otp",
                            title: "Resend OTP",
                            type: "rest",
                            method: "post",
                            url: "",
                            dev_url: REST_API_URLS.SEND_LOGIN_OTP,
                            parameters: [{
                                id: "username",
                                isMendatory: false,
                            }]
                        },
                        customClass: "row-item-secondary"
                    },

                ],
                actions: [{
                    title: "Sign In",
                    id: "login",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/login",
                    parameters: [
                        {
                            id: "username",
                            isMendatory: true
                        },
                        {
                            id: "password",
                            isMendatory: true
                        }
                    ]
                }]
            }
        }
    },
    widgetConfig: {
        showHeader: true,
        customClass: "app-forms app-login"
    }
};

STATICWIDGETS["REGISTER"] = {
    name: "form",
    title: "Register",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Register",
                fields: [
                    {
                        id: "gid",
                        title: "User type",
                        type: "dropdown",
                        dataProvider: {
                            "title": "showUserType",
                            "type": "rest",
                            "method": "get",
                            "url": "",
                            "dev_url": "http://gsaserver.technideus.com/public/loadUserTypes",
                            "transformationType": "RAW",
                            "otherDetails": {
                                "fieldId": "gid"
                            },
                        },
                        required: true,
                    },
                    {
                        id: "name",
                        title: "First name",
                        type: "text",
                        required: true,
                    },
                    {
                        id: "last_name",
                        title: "Last name",
                        type: "text"
                    },
                    {
                        id: "email",
                        title: "Email address",
                        type: "email",
                        required: true,
                    },
                    {
                        id: "primary",
                        title: "Primary contact",
                        type: "text",
                        required: true,
                    },
                    {
                        id: "password",
                        title: "Password",
                        type: "password",
                        required: true,
                    },
                    {
                        id: "confirmpassword",
                        title: "Confirm password",
                        type: "password",
                        required: true,
                    }
                   
                ],
                actions: [
                    {
                        title: "Register",
                        id: "register",
                        type: "rest",
                        method: "post",
                        url: "",
                        dev_url: "http://gsaserver.technideus.com/public/register",
                        parameters: [ 
                            {
                            id: "domainId",
                            isMendatory: false,
                            source: "system",
                            sourceValue: "domainId"
                        }],
                        sendAllParam: true,
                        responseHandler: {
                            type: "navigate",
                            actionInfo: {
                                "type": "url",
                                "title": "Verifiy Email & Mobile",
                                "url": "./user-verification",
                                "parameters": [
                                    {
                                        "id": "userId",
                                        "isMendatory": true
                                    }
                                ],
                            }
                        }
                    }]
            },
            formConfig: {
                isRegistrationForm: true,
            }
        }
    },
    widgetConfig: {
        showHeader: true,
        customClass: "app-forms app-login"
    }
};

STATICWIDGETS["LOGINANDREGISTER"] = {
    name: "tabs",
    title: "",
    dataProvider: {
        type: "INLINE",
        data: {
            tabs: [
                {
                    title: "Login",
                    widgets: [STATICWIDGETS['LOGIN']]
                },
                {
                    title: "Register",
                    widgets: [STATICWIDGETS['REGISTER']]
                },
            ]
        }
    }
}

STATICWIDGETS["USERVERIFICATION"] = {
    name: "form",
    title: "Verify Email & Primary Contact",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                fields: [
                    {
                        id: "verify-by-email",
                        title: "User name",
                        type: "plainText",
                        text: Constants.USERVERIFY.EMAIL_LINK,
                    },
                    {
                        id: "verify-by-otp",
                        title: "User name",
                        type: "plainText",
                        text: Constants.USERVERIFY.PHONE_HINT,
                    },
                    {
                        id: "mobile_activation",
                        title: "Enter OTP",
                        type: "text",
                        required: true,
                    },
                ],
                actions: [{
                    title: "Verify",
                    id: "verifyOTP",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: REST_API_URLS.VERIFY_MOBILE,
                    parameters: [
                        {
                            id: "userId",
                            isMendatory: true,
                            source: "route",
                            sourceValue: "userId"
                        },
                        {
                            id: "mobile_activation",
                            isMendatory: true,
                        }
                    ],
                    responseHandler: {
                        type: "navigate",
                        actionInfo: {
                            "type": "url",
                            "title": "Login",
                            "url": "./login",
                        }
                    }
                }]
            }
        }
    },
    widgetConfig: {
        showHeader: true,
        customClass: "center-align-content"
    }
}

STATICWIDGETS["USERVEREMAILIFICATION"] = {
    name: "form",
    title: "Verify Email & Primary Contact",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                fields: [
                    {
                        id: "verify-by-email",
                        title: "User name",
                        type: "plainText",
                        text: Constants.USERVERIFY.EMAIL_LINK,
                    },
                    {
                        id: "verify-by-otp",
                        title: "User name",
                        type: "plainText",
                        text: Constants.USERVERIFY.PHONE_HINT,
                    },
                    // {
                    //     id: "mobile_activation",
                    //     title: "Enter OTP",
                    //     type: "text",
                    //     required: true,
                    // },
                ]
                
            }
        }
    },
    widgetConfig: {
        showHeader: true,
        customClass: "center-align-content"
    }
}
STATICWIDGETS["SETTINGS"] = {
    name: "form",
    title: "Options",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Options",
                fields: [
                    {
                        id: "settings",
                        title: "",
                        type: "list",
                        options: [
                            { value: "RTL" },
                            { value: "DARK_THEME", title: "Dark Mode" },
                            { value: "BOXED", title: "Boxed Layout" },
                            { value: "HORIZONTAL", title: "Horizontal Navigation" }
                        ],
                        required: false,
                    }
                ],
                actions: [{
                    title: "Save",
                    id: "savesettings",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "./config/dummyServer/callhandler.php",
                    parameters: [
                        {
                            id: "settings",
                            isMendatory: true
                        }
                    ]
                }]
            }
        }
    }
};

STATICWIDGETS["SIDEBARMENU"] = {
    name: "Menu",
    title: "Menu",
    dataProvider: {
        "title": "Menu",
        "type": "rest",
        "method": "get",
        "url": "",
        "dev_url": "http://gsaserver.technideus.com/public/menuList",
        "parameters": [{
            "id": "userId",
            "isMendatory": false
        }],
        "transformationType": "RAW",
    },
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true,
    },
    "metaType": "menu",
    "transformationType": "RAW",
};

STATICWIDGETS["ADDMENU"] = {
    name: "form",
    title: "Add menu item",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add menu item",
                fields: [{
                    id: "parentId",
                    title: "Parent",
                    type: "dropdown",
                    dataProvider: {
                        "title": "showMenuItem",
                        "type": "rest",
                        "method": "get",
                        "url": "",
                        "dev_url": "http://gsaserver.technideus.com/public/loadMenuParent",
                        "parameters": [
                            {
                                "id": "userId",
                                "isMendatory": false,
                                "source": "system",
                            }],
                        "transformationType": "RAW",
                        "otherDetails": {
                            "fieldId": "parentId"
                        },
                    }
                },
                {
                    id: "type",
                    title: "Type",
                    type: "dropdown",
                    dataProvider: {
                        "title": "showMenuItem",
                        "type": "inline",
                        "data": [
                            {
                                id: "appContent",
                                title: "Content"
                            },
                            {
                                id: "appLink",
                                title: "External URL"
                            }
                        ],
                        "transformationType": "RAW",
                        "otherDetails": {
                            "fieldId": "type"
                        },
                    }
                },
                {
                    id: "title",
                    title: "title",
                    type: "text"
                },
                {
                    id: "content",
                    title: "Content",
                    type: "richText"
                }
                ],
                actions: [{
                    title: "Add",
                    id: "addMenu",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/addMenu",
                    parameters: [
                        {
                            id: "title",
                            isMendatory: true
                        },
                        {
                            id: "type",
                            isMendatory: true,
                            default: "appContent"
                        },
                        {
                            id: "content",
                            isMendatory: false
                        },
                        {
                            id: "userId",
                            isMendatory: false
                        },
                        {
                            id: "parentId",
                            isMendatory: false
                        }
                    ]
                }
                ]
            }
        }
    }
};

STATICWIDGETS["EDITMENU"] = {
    name: "form",
    title: "Edit menu item",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Edit menu item",
                fields: [
                    {
                        id: "parentId",
                        title: "Parent",
                        type: "dropdown",
                        dataProvider: {
                            "title": "showMenuItem",
                            "type": "rest",
                            "method": "get",
                            "url": "",
                            "dev_url": "http://gsaserver.technideus.com/public/loadMenuParent",
                            "parameters": [
                                {
                                    "id": "userId",
                                    "isMendatory": false,
                                    "source": "system",
                                }],
                            "transformationType": "RAW",
                            "otherDetails": {
                                "fieldId": "parentId"
                            },
                        }
                    },
                    {
                        id: "type",
                        title: "Type",
                        type: "dropdown",
                        dataProvider: {
                            "title": "showMenuItem",
                            "type": "inline",
                            "data": [
                                {
                                    id: "appContent",
                                    title: "Content"
                                },
                                {
                                    id: "appLink",
                                    title: "External URL"
                                }
                            ],
                            "transformationType": "RAW",
                            "otherDetails": {
                                "fieldId": "type"
                            },
                        }
                    },
                    {
                        id: "title",
                        title: "title",
                        type: "text"
                    },
                    {
                        id: "content",
                        title: "Content",
                        type: "richText"
                    },
                    {
                        id: "id",
                        title: "menuId",
                        type: "hidden"
                    }
                ],
                actions: [{
                    title: "Edit",
                    id: "editMenu",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/editMenu",
                    parameters: [
                        {
                            id: "title",
                            isMendatory: true
                        },
                        {
                            id: "type",
                            isMendatory: true,
                            default: "appContent"
                        },
                        {
                            id: "id",
                            isMendatory: true,
                        },
                        {
                            id: "content",
                            isMendatory: false
                        },
                        {
                            id: "userId",
                            isMendatory: false
                        },
                        {
                            id: "parentId",
                            isMendatory: false
                        }
                    ]
                }
                ]
            },
            formDataProvider: {
                "title": "showMenuItem",
                "type": "rest",
                "method": "get",
                "url": "",
                "dev_url": "http://gsaserver.technideus.com/public/loadMenuItem",
                "parameters": [{
                    "id": "id",
                    "isMendatory": true,
                    "source": "route",
                }],
                "transformationType": "RAW"
            }
        }
    }
};

STATICWIDGETS["SHOWMENUITEM"] = {
    name: "textViewer",
    title: "textViewer",
    dataProvider: {
        "title": "showMenuItem",
        "type": "rest",
        "method": "get",
        "url": "",
        "dev_url": "http://gsaserver.technideus.com/public/menuItem",
        "parameters": [
            {
                "id": "userId",
                "isMendatory": false
            },
            {
                "id": "title",
                "isMendatory": true,
                "source": "route",
                "sourceValue": "menuTitle"
            },
        ],
        "transformationType": "RAW"
    },
    "metaType": "menu"
};


STATICWIDGETS["TEAMLIST"] = {
    name: "Teams",
    title: "Teams",
    dataProvider: {
        "title": "Teams",
        "type": "rest",
        "method": "get",
        "url": "",
        "dev_url": "http://gsaserver.technideus.com/public/teamList",
        "parameters": [
            {
                "id": "userId",
                "isMendatory": false
            },
            {
                "id": "pagingInfo",
                "isMendatory": false
            },
            {
                id: "team_name",
                isMendatory: false,
            },
            {
                id: "team_email",
                isMendatory: false,
            },
            {
                id: "sportId",
                isMendatory: false,
            },
            {
                id: "state",
                isMendatory: false,
            },
            {
                id: "agegroup",
                isMendatory: false,
            },
            {
                id: "classification",
                isMendatory: false,
            }
        ]
    },
    widgetConfig: {
        showHeader: false,
    },
    "metaType": "team"
};

STATICWIDGETS["TEAMLISTFILTER"] = {
    name: "form",
    title: "Teams",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Teams",
                rows: [
                    {
                        fields: [
                            {
                                id: "sportId",
                                title: "Sport",
                                type: "dropdown",
                                dependencyInfo: [
                                    {
                                        fieldId: "agegroup",
                                        type: "dataReload"
                                    },
                                    {
                                        fieldId: "classification",
                                        type: "dataReload"
                                    }],
                                dataProvider: {
                                    "title": "showSports",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSports",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "sportId"
                                    },
                                }
                            },
                            {
                                id: "state",
                                title: "State",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showStates",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllStates",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "state"
                                    },
                                }
                            },
                            {
                                id: "agegroup",
                                title: "Agegroup",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showAgegroups",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllAgegroupOfSport",
                                    "parameters": [
                                        {
                                            "id": "sportId",
                                            "isMendatory": true,
                                        },
                                        {
                                            "id": "columnToFetch",
                                            "isMendatory": true,
                                            "type": "inline",
                                            "default": ["id, agegroup as title"]
                                        }
                                    ],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "agegroup"
                                    },
                                }
                            },
                            {
                                id: "classification",
                                title: "Classification",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showClassification",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllClassificationOfSport",
                                    "parameters": [
                                        {
                                            "id": "sportId",
                                            "isMendatory": true
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "classification"
                                    },
                                }
                            },
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "team_name",
                                title: "Name",
                                type: "text"
                            },
                            {

                                id: "team_email",
                                title: "Email",
                                type: "text"
                            },
                            {
                                id: "primary",
                                title: "Contact No.",
                                type: "text"
                            },
                        ]
                    },

                ],
                actions: [
                    {
                        title: "Filter teams",
                        id: "fetchteams",
                        type: "local",
                        responseHandler: {
                            type: "widgetLoad",
                            widgetInfoList: [
                                {
                                    widget: STATICWIDGETS["TEAMLIST"],
                                    dataAction: "fillParameterDefault",
                                }
                            ]
                        }
                    },
                ]
            },
            formConfig: {
                submitOnLoad: true,
            },
        },
    }
};

STATICWIDGETS["TOURNAMENTLIST"] = {
    name: "Tournaments",
    title: "Tournaments",
    dataProvider: {
        "title": "Tournaments",
        "type": "rest",
        "method": "get",
        "url": "",
        "dev_url": "http://gsaserver.technideus.com/public/tournamentList",
        "parameters": [
            {
                "id": "userId",
                "isMendatory": false
            },
            {
                "id": "pagingInfo",
                "isMendatory": false
            },
            {
                id: "sportId",
                isMendatory: false,
            },
            {
                id: "state",
                isMendatory: false,
            },
            {
                id: "start_date",
                isMendatory: false,
            },
            {
                id: "end_date",
                isMendatory: false,
            },
            {
                id: "show_in_front",
                isMendatory: true,
                default: "1"
            }
        ]
    },
    "metaType": "tournament",
    widgetConfig: {
        showHeader: false,
    }
};

STATICWIDGETS["TOURNAMENTLISTFILTER"] = {
    name: "form",
    title: "Tournaments",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Tournaments",
                rows: [
                    {
                        fields: [
                            {
                                id: "sportId",
                                title: "Sport",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showSports",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSports",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "sportId"
                                    },
                                }
                            },
                            {
                                id: "state",
                                title: "State",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showStates",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllStates",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "state"
                                    },
                                }
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "directorid",
                                title: "Other director",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "Fetch Directors",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllDirectors",
                                    "parameters": [],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "directorid"
                                    },
                                }
                            },
                            {
                                id: "start_date",
                                title: "Start date",
                                type: "date"
                            },
                            {
                                id: "end_date",
                                title: "End date",
                                type: "date"
                            },
                        ],
                    }
                ],
                actions: [
                    {
                        title: "Fetch tournaments",
                        id: "fetchteams",
                        type: "local",
                        responseHandler: {
                            type: "widgetLoad",
                            widgetInfoList: [
                                {
                                    widget: STATICWIDGETS["TOURNAMENTLIST"],
                                    dataAction: "fillParameterDefault",
                                }
                            ]
                        }
                    },
                ]
            },
            formConfig: {
                submitOnLoad: true,
            },
        },
    }
};

STATICWIDGETS["USERLIST"] = {
    name: "Teams",
    title: "Teams",
    dataProvider: {
        "title": "Teams",
        "type": "rest",
        "method": "get",
        "url": "",
        "dev_url": "http://gsaserver.technideus.com/public/userList",
        "parameters": [{
            "id": "userId",
            "isMendatory": false
        }, {
            "id": "pagingInfo",
            "isMendatory": false
        }]
    },
    "metaType": "team"
};

STATICWIDGETS["TOURNAMENTRANKING"] = {
    name: "ranking",
    title: "Tournament Ranking",
    dataProvider: {
        "title": "Ranking",
        "type": "rest",
        "method": "get",
        "url": "",
        "dev_url": REST_API_URLS.TOURNAMENT_RANKING,
        "transformationType": "raw",
        "parameters": [
            {
                id: "year",
                isMendatory: true,
            },
            {
                id: "sportId",
                isMendatory: true,
            },
            {
                id: "state",
                isMendatory: true,
            },
            {
                id: "agegroup",
                isMendatory: true,
            },
            {
                id: "classification",
                isMendatory: true,
            },
            {
                id: "ranking_type",
                isMendatory: true,
            }
        ]
    },
    widgetConfig: {
        showHeader: false,
    },
    "metaType": "ranking",
};

STATICWIDGETS["RANKINGFILTER"] = {
    name: "form",
    title: "Tournament Ranking",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Rankings",
                rows: [
                    {
                        fields: [
                            {
                                id: "year",
                                title: "Year",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showYears",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSeasonYear",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "year"
                                    },
                                }
                            },
                            {
                                id: "ranking_type",
                                title: "Ranking Type",
                                type: "dropdown",
                                options: AppConstants.getRankingTypes()
                            }]
                    },
                    {
                        fields: [
                            {
                                id: "state",
                                title: "State",
                                type: "autoComplete",
                                sameIdTitle: true,
                                dataProvider: {
                                    "title": "showStates",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllStates",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "state"
                                    },
                                }
                            },
                            {
                                id: "sportId",
                                title: "Sport",
                                type: "dropdown",
                                dependencyInfo: [
                                    {
                                        fieldId: "agegroup",
                                        type: "dataReload"
                                    },
                                    {
                                        fieldId: "classification",
                                        type: "dataReload"
                                    }],
                                dataProvider: {
                                    "title": "showSports",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSports",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "sportId"
                                    },
                                }
                            }]
                    },
                    {
                        fields: [
                            {
                                id: "agegroup",
                                title: "Agegroup",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showAgegroups",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllAgegroupOfSport",
                                    "parameters": [
                                        {
                                            "id": "sportId",
                                            "isMendatory": true,
                                        },
                                        {
                                            "id": "columnToFetch",
                                            "isMendatory": true,
                                            "type": "inline",
                                            "default": ["id, agegroup as title"]
                                        }
                                    ],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "agegroup"
                                    },
                                }
                            },
                            {
                                id: "classification",
                                title: "Classification",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showClassification",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllClassificationOfSport",
                                    "parameters": [
                                        {
                                            "id": "sportId",
                                            "isMendatory": true
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "classification"
                                    },
                                }
                            },
                        ]
                    },
                ],
                actions: [
                    {
                        title: "Filter rankings",
                        id: "fetchranking",
                        type: "local",
                        responseHandler: {
                            type: "widgetLoad",
                            widgetInfoList: [
                                {
                                    widget: STATICWIDGETS["TOURNAMENTRANKING"],
                                    dataAction: "fillParameterDefault",
                                }
                            ]
                        }
                    },
                ]
            },
            formConfig: {
                submitOnLoad: true,
            },
        },
    }
};

STATICWIDGETS["WHOISPLAYING"] = TOURNAMENTPROFILEWIDGETS['WHOISPLAYING']

STATICWIDGETS["APPSEARCH"] = {
    name: "form",
    title: "Search",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Search",
                fields: [
                    {
                        id: "searchText",
                        title: "User name",
                        type: "text",
                        placeholder: "Search any team,tournament and user"
                    }
                ],
                actions: [{
                    title: "Search",
                    id: "searchapp",
                    type: "rest",
                    method: "get",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/appsearch",
                    parameters: [
                        {
                            id: "searchText",
                            isMendatory: true
                        }
                    ]
                }]
            },
            formConfig: {
                customClass: "app-search-form"
            },
        }
    }
};

STATICWIDGETS["ADDTOURNAMENT"] = {
    name: "form",
    title: "Post A Tournament",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add tournament",
                rows: [
                    {
                        fields: [{
                            id: "other_director_heading",
                            type: "plainText",
                            text: Constants.TOURNAMENTADD.OTHER_DIRECTOR_HEADING,
                            subType: "heading",
                        }]
                    },
                    {
                        fields: [
                            {
                                id: "other_director_desc",
                                type: "plainText",
                                text: Constants.TOURNAMENTADD.OTHER_DIRECTOR_DESC
                            },
                            {
                                id: "directorid",
                                title: "Other director",
                                type: "autoComplete",
                                dataProvider: {
                                    "title": "Fetch Directors",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllDirectors",
                                    "parameters": [
                                        {
                                            "id": "except",
                                            "isMendatory": false,
                                            "source": "system",
                                            "sourceValue": "userId"
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "directorid"
                                    },
                                }
                            }],
                    },
                    {
                        fields: [{
                            id: "basic_info_heading",
                            type: "plainText",
                            text: Constants.TOURNAMENTADD.BASIC_INFORMATION_HEADING,
                            subType: "heading",
                        }]
                    },
                    {
                        fields: [
                            {
                                id: "title",
                                title: "title",
                                type: "text",
                                required: true,
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "description",
                                title: "Description",
                                type: "text",
                                multiline: true,
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "is_double",
                                title: "Point double?",
                                type: "checkbox",
                            }
                        ]
                    },
                    {
                        fields: [{
                            id: "details_heading",
                            type: "plainText",
                            text: Constants.TOURNAMENTADD.DETAILS_HEADING,
                            subType: "heading",
                        }]
                    },
                    {
                        fields: [
                            {
                                id: "start_date",
                                title: "Start date",
                                type: "date",
                                required: true,
                            },
                            {
                                id: "end_date",
                                title: "End date",
                                type: "date",
                                required: true,
                            },
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "state",
                                title: "State",
                                type: "dropdown",
                                required: true,
                                dataProvider: {
                                    "title": "showStates",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllStates",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "state"
                                    },
                                },
                                dependencyInfo: [
                                    {
                                        fieldId: "parkId",
                                        isGroup: "true",
                                        groupField: "parkDetails",
                                        type: "dataReload"
                                    }
                                ]
                            },
                            {
                                id: "sportId",
                                title: "Sport",
                                type: "dropdown",
                                required: true,
                                dependencyInfo: [
                                    {
                                        fieldId: "fromAgegroup",
                                        isGroup: "true",
                                        groupField: "fees",
                                        type: "dataReload"
                                    },
                                    {
                                        fieldId: "toAgegroup",
                                        isGroup: "true",
                                        groupField: "fees",
                                        type: "dataReload"
                                    }],
                                dataProvider: {
                                    "title": "showSports",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSports",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "sportId"
                                    },
                                }
                            }]
                    },
                    {
                        fields: [{
                            id: "agegroup_cost_heading",
                            type: "plainText",
                            text: Constants.TOURNAMENTADD.AGEGROUP_COST_HEADING,
                            subType: "heading",
                        }]
                    },
                    {
                        fields: [
                            {
                                id: "same_for_all_agroup",
                                title: "Same fee for all agegroups?",
                                type: "checkbox",
                                dependencyInfo: [
                                    {
                                        fieldId: "cost",
                                        type: "enableDisable",
                                        enableOn: [true]
                                    },
                                    {
                                        fieldId: "fees",
                                        type: "showHide",
                                        displayOn: [false],
                                    }]
                            },
                            {
                                id: "cost",
                                title: "Fees",
                                type: "number",
                                required: true,
                                disable: true,
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "fees",
                                title: "Fees",
                                type: "group",
                                fields: [
                                    {
                                        id: "fromAgegroup",
                                        title: "From agegroup",
                                        type: "dropdown",
                                        dataProvider: {
                                            "title": "showAgegroups",
                                            "type": "rest",
                                            "method": "get",
                                            "url": "",
                                            "dev_url": "http://gsaserver.technideus.com/public/loadAllAgegroupOfSport",
                                            "parameters": [
                                                {
                                                    "id": "sportId",
                                                    "isMendatory": true
                                                }],
                                            "transformationType": "RAW",
                                            "otherDetails": {
                                                "fieldId": "fromAgegroup"
                                            },
                                        }
                                    },
                                    {
                                        id: "toAgegroup",
                                        title: "To agegroup",
                                        type: "dropdown",
                                        dataProvider: {
                                            "title": "showAgegroups",
                                            "type": "rest",
                                            "method": "get",
                                            "url": "",
                                            "dev_url": "http://gsaserver.technideus.com/public/loadAllAgegroupOfSport",
                                            "parameters": [
                                                {
                                                    "id": "sportId",
                                                    "isMendatory": true
                                                }],
                                            "transformationType": "RAW",
                                            "otherDetails": {
                                                "fieldId": "toAgegroup"
                                            },
                                        }
                                    },
                                    {
                                        id: "cost",
                                        title: "Fees",
                                        type: "number"
                                    },
                                ]
                            }]
                    },
                    {
                        fields: [{
                            id: "gate_fees",
                            type: "number",
                            title: "Gate Fee",
                        }]
                    },
                    {
                        fields: [{
                            id: "reservation_fees",
                            type: "number",
                            title: "Reservation Fee",
                        }]
                    },
                    {
                        fields: [{
                            id: "location_heading",
                            type: "plainText",
                            text: Constants.TOURNAMENTADD.LOCATION_HEADING,
                            subType: "heading",
                        }]
                    },
                    {
                        fields: [
                            {
                                id: "parkDetails",
                                title: "Park details",
                                type: "group",
                                required: true,
                                fields: [{
                                    id: "parkId",
                                    title: "Park name",
                                    type: "autoComplete",
                                    dataProvider: {
                                        "title": "showParks",
                                        "type": "rest",
                                        "method": "get",
                                        "url": "",
                                        "dev_url": "http://gsaserver.technideus.com/public/loadAllParks",
                                        "parameters": [
                                            {
                                                "id": "state",
                                                "isMendatory": false,
                                            }],
                                        "transformationType": "RAW",
                                        "otherDetails": {
                                            "fieldId": "parkId"
                                        },
                                    },
                                    dependencyInfo: [
                                        {
                                            fieldId: "parkAddress",
                                            isGroup: "true",
                                            groupField: "parkDetails",
                                            type: "dataReload",
                                            required: true,
                                        },
                                        {
                                            fieldId: "parkCity",
                                            isGroup: "true",
                                            groupField: "parkDetails",
                                            type: "dataReload"
                                        },
                                        {
                                            fieldId: "parkZipCode",
                                            isGroup: "true",
                                            groupField: "parkDetails",
                                            type: "dataReload"
                                        },
                                    ]
                                },
                                {
                                    id: "parkAddress",
                                    title: "Address",
                                    type: "text",
                                    dataProvider: {
                                        "title": "showParkAddress",
                                        "type": "rest",
                                        "method": "get",
                                        "url": "",
                                        "dev_url": "http://gsaserver.technideus.com/public/loadParkDetail",
                                        "parameters": [
                                            {
                                                "id": "parkId",
                                                "isMendatory": true
                                            },
                                            {
                                                "id": "columnToFetch",
                                                "isMendatory": true,
                                                "type": "inline",
                                                "default": ["address"]
                                            }],
                                        "transformationType": "RAW",
                                        "otherDetails": {
                                            "fieldId": "parkAddress"
                                        },
                                    }
                                },
                                {
                                    id: "parkCity",
                                    title: "City",
                                    type: "text",
                                    dataProvider: {
                                        "title": "showParkAddress",
                                        "type": "rest",
                                        "method": "get",
                                        "url": "",
                                        "dev_url": "http://gsaserver.technideus.com/public/loadParkDetail",
                                        "parameters": [
                                            {
                                                "id": "parkId",
                                                "isMendatory": true
                                            },
                                            {
                                                "id": "columnToFetch",
                                                "isMendatory": true,
                                                "type": "inline",
                                                "default": ["city"]
                                            }],
                                        "transformationType": "RAW",
                                        "otherDetails": {
                                            "fieldId": "parkCity"
                                        },
                                    }
                                },
                                {
                                    id: "parkZipCode",
                                    title: "Zip code",
                                    type: "text",
                                    dataProvider: {
                                        "title": "showParkAddress",
                                        "type": "rest",
                                        "method": "get",
                                        "url": "",
                                        "dev_url": "http://gsaserver.technideus.com/public/loadParkDetail",
                                        "parameters": [
                                            {
                                                "id": "parkId",
                                                "isMendatory": true
                                            },
                                            {
                                                "id": "columnToFetch",
                                                "isMendatory": true,
                                                "type": "inline",
                                                "default": ["zip"]
                                            }],
                                        "transformationType": "RAW",
                                        "otherDetails": {
                                            "fieldId": "parkZipCode"
                                        },
                                    }
                                }
                                ]
                            }]
                    },

                ],
                actions: [{
                    title: "Post Tournament",
                    id: "addTournament",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/addTournament",
                    sendAllParam: true,
                    parameters: [
                        {
                            id: "postedBy",
                            isMendatory: true,
                            source: "system",
                            sourceValue: "userId"
                        }
                    ],
                    responseHandler: {
                        type: "navigate",
                        actionInfo: {
                            "type": "url",
                            "title": "Visit Tournament",
                            "url": "./tournament-profile",
                            "parameters": [
                                {
                                    "id": "tournamentId",
                                    "isMendatory": true
                                }
                            ],
                        }
                    }
                }
                ]
            }
        }
    }
}

STATICWIDGETS["ADDTEAM"] = {
    name: "form",
    title: "Add a team",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add team",
                rows: [
                    {
                        fields: [
                            {
                                id: "not_coach_description",
                                type: "plainText",
                                text: Constants.TEAM_CREATE_NOT_COACH_BY_COACH,
                                customClass: "highlighted-font",
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "user_name",
                                title: "First name",
                                type: "text"
                            },
                            {
                                id: "user_email",
                                title: "Email address",
                                type: "text"
                            },
                            {
                                id: "user_primary",
                                title: "Phone",
                                type: "text"
                            },
                            {
                                id: "user_password",
                                title: "Password",
                                type: "password"
                            },
                            {
                                id: "user_verifyPassword",
                                title: "Verify password",
                                type: "password"
                            }

                        ],
                        separator: true,
                    },
                    {
                        fields: [
                            {
                                id: "state",
                                title: "State",
                                type: "dropdown",
                                required: true,
                                dataProvider: {
                                    "title": "showStates",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllStates",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "state"
                                    },
                                }
                            },
                            {
                                id: "sportId",
                                title: "Sport",
                                type: "dropdown",
                                required: true,
                                dependencyInfo: [
                                    {
                                        fieldId: "agegroup",
                                        type: "dataReload"
                                    },
                                    {
                                        fieldId: "classification",
                                        type: "dataReload"
                                    }
                                ],
                                dataProvider: {
                                    "title": "showSports",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSports",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "sportId"
                                    },
                                }
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "name",
                                title: "Team Name",
                                type: "text",
                                required: true,
                            },
                            {
                                id: "agegroup",
                                title: "Agegroup",
                                type: "dropdown",
                                required: true,
                                dataProvider: {
                                    "title": "showAgegroups",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllAgegroupOfSport",
                                    "parameters": [
                                        {
                                            "id": "sportId",
                                            "isMendatory": true
                                        },
                                        {
                                            "id": "columnToFetch",
                                            "isMendatory": true,
                                            "default": ["id as id", "agegroup as title"],
                                        }
                                    ],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "agegroup"
                                    },
                                }
                            },
                            {
                                id: "classification",
                                title: "Classification",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showClassification",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllClassificationOfSport",
                                    "parameters": [
                                        {
                                            "id": "sportId",
                                            "isMendatory": true
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "classification"
                                    },
                                }
                            },
                        ],

                    },
                    {
                        fields: [
                            {
                                id: "team_city",
                                title: "City",
                                type: "text"
                            },
                            {
                                id: "team_primary",
                                title: "Primary No",
                                type: "text",
                                required: true,
                            },
                            {
                                id: "team_secondary",
                                title: "Secondary No",
                                type: "text"
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "coach_name",
                                title: "Coache's name",
                                type: "text",
                                required: true,
                            },
                            {
                                id: "coach_email",
                                title: "Coache's email",
                                type: "text",
                                required: true,
                            },
                            {
                                id: "coach_password",
                                title: "Password",
                                type: "password"
                            },
                            {
                                id: "coach_verifyPassword",
                                title: "Verify password",
                                type: "password"
                            },
                        ]
                    }
                ],
                actions: [{
                    title: "Create Team",
                    id: "addTeam",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/addTeam",
                    responseHandler: {
                        type: "navigate",
                        actionInfo: {
                            "type": "url",
                            "title": "Team profile created successfully",
                            "url": "./team-profile",
                            "parameters": [
                                {
                                    "id": "teamId",
                                    "isMendatory": true
                                }
                            ],
                        }
                    },
                    sendAllParam: true,
                    parameters: [
                        {
                            id: "userId",
                            isMendatory: false,
                            source: "route",
                            sourceValue: "userId"
                        }
                    ]
                }
                ]
            }
        }
    }
}

STATICWIDGETS["ADDROSTER"] = {
    name: "form",
    title: "Add a team roster",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add team",
                rows: [
                    {
                        fields: [
                            {
                                id: "season_year",
                                title: "Year",
                                type: "dropdown",
                                isNonEmpty: true,
                                dataProvider: {
                                    "title": "showYears",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllSeasonYear",
                                    "parameters": [
                                        {
                                            "id": "userId",
                                            "isMendatory": false,
                                            "source": "system",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "year"
                                    },
                                },
                                dependencyInfo: [
                                    {
                                        fieldId: "playerDetails",
                                        type: "dataReload"
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "playerDetails",
                                title: "Player Details",
                                type: "group",
                                required: true,
                                allRemovable: true,
                                fields: [
                                    {
                                        id: "player_image",
                                        title: "Image",
                                        type: "file"
                                    },
                                    {
                                        id: "player_roster_id",
                                        title: "Hidden Id",
                                        type: "text",
                                        hidden: true,
                                    },
                                    {
                                        id: "image",
                                        title: "Current Image",
                                        type: "image",
                                        imageSource: "teamRoster",
                                        customClass: "team-roster-image",
                                    },
                                    {
                                        id: "player_image_hidden",
                                        title: "Image Value",
                                        type: "text",
                                        hidden: true,
                                    },
                                    {
                                        id: "name",
                                        title: "Name",
                                        type: "text"
                                    },
                                    {
                                        id: "position",
                                        title: "Position",
                                        type: "text"
                                    },
                                ],
                                dataProvider: {
                                    "title": "showBracketMatches",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": REST_API_URLS.TEAM_ROSTER,
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "playerDetails",
                                        "isGroup": true,
                                    },
                                    "parameters": [
                                        {
                                            id: "season_year",
                                            isMendatory: true,
                                        },
                                        {
                                            id: "teamId",
                                            isMendatory: true,
                                            source: "route",
                                            sourceValue: "teamId"
                                        }
                                    ]
                                }
                            },
                        ]
                    }
                ],
                actions: [
                    {
                        title: "Create Team Roster",
                        id: "addRoster",
                        type: "rest",
                        method: "fileUpload",
                        url: "",
                        dev_url: "http://gsaserver.technideus.com/public/addRoster",
                        sendAllParam: true,
                        doFileUpload: true,
                        responseHandler: {
                            type: "navigate",
                            actionInfo: {
                                "type": "url",
                                "title": "Roster success",
                                "url": "./team-profile",
                                "parameters": [
                                    {
                                        "id": "teamId",
                                        "isMendatory": true
                                    }
                                ],
                            }
                        },
                        fileUploadFields: [
                            {
                                id: "playerDetails",
                                isGroup: true,
                                groupFieldIds: ["player_image"]
                            },
                        ],
                        parameters: [
                            {
                                id: "userId",
                                isMendatory: false,
                                source: "system",
                                sourceValue: "userId"
                            },
                            {
                                id: "teamId",
                                isMendatory: false,
                                source: "route",
                                sourceValue: "teamId"
                            }
                        ]
                    }
                ]
            }
        }
    }
}

STATICWIDGETS["ADDTEAMBANNER"] = {
    name: "form",
    title: "Add Team Banner image",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add Team Banner image",
                rows: [
                    {
                        fields: [
                            {
                                id: "group_banner",
                                title: "Add Gallery Images",
                                type: "image",
                                imageSource: "teamBanner",
                                customClass: "team-banner-image"

                            },
                            {
                                id: "group_banner_image",
                                title: "Banner Image",
                                type: "file",
                            },
                        ]
                    }
                ],
                actions: [
                    {
                        title: "Update team banner",
                        id: "addTeamBanner",
                        type: "rest",
                        method: "fileUpload",
                        url: "",
                        dev_url: REST_API_URLS.UPDATE_TEAM_BANNER,
                        sendAllParam: true,
                        doFileUpload: true,
                        responseHandler: {
                            type: "navigate",
                            actionInfo: {
                                "type": "url",
                                "title": "Banner image upload success",
                                "url": "./team-profile",
                                "parameters": [
                                    {
                                        "id": "teamId",
                                        "isMendatory": true
                                    }
                                ],
                            }
                        },
                        fileUploadFields: [
                            {
                                id: "group_banner_image"
                            },
                        ],
                        parameters: [
                            {
                                id: "userId",
                                isMendatory: false,
                                source: "system",
                                sourceValue: "userId"
                            },
                            {
                                id: "teamId",
                                isMendatory: false,
                                source: "route",
                                sourceValue: "teamId"
                            }
                        ]
                    }
                ]
            },
            formDataProvider: {
                "title": "showTeamBanner",
                "type": "rest",
                "method": "get",
                "url": "",
                "dev_url": REST_API_URLS.TEAM_BANNER,
                "parameters": [
                    {
                        "id": "teamId",
                        "isMendatory": true,
                        "source": "route",
                    },
                ],
                "transformationType": "RAW"
            }
        }
    }
}


STATICWIDGETS["UPDATESITEDETAILS"] = {
    name: "form",
    title: "Update site details",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Update site details",
                rows: [
                    {
                        fields: [
                            {
                                id: "siteHeading",
                                title: "Site heading",
                                type: "text",
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "siteNews",
                                title: "Site news",
                                type: "text",
                            },
                        ]
                    }
                ],
                actions: [
                    {
                        title: "Update site details",
                        id: "updateSiteGlobals",
                        type: "rest",
                        method: "post",
                        url: "",
                        dev_url: REST_API_URLS.UPDATE_SITE_GLOBALS,
                        sendAllParam: true,
                        responseHandler: {
                            type: "updateSiteGlobals",
                        },
                        parameters: [
                            {
                                id: "userId",
                                isMendatory: false,
                                source: "system",
                                sourceValue: "userId"
                            },
                            {
                                id: "domainId",
                                isMendatory: false,
                                source: "system",
                                sourceValue: "domainId"
                            },
                        ]
                    }
                ]
            },
            formDataProvider: {
                "title": "showSiteDetails",
                "type": "rest",
                "method": "get",
                "url": "",
                "dev_url": REST_API_URLS.LOAD_SITE_GLOBALS,
                "transformationType": "RAW",
                "parameters": [
                    {
                        "id": "domain",
                        "isMendatory": true,
                        "source": "system",
                        "isSystem": true,
                    },
                ],
            }
        }
    }
}

STATICWIDGETS["UPDATETEAMGALLERY"] = {
    name: "form",
    title: "Update team gallery ",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add team gallery",
                rows: [
                    {
                        fields: [
                            {
                                id: "galleryDetails",
                                title: "Gallery Details",
                                type: "group",
                                required: true,
                                allRemovable: true,
                                fields: [
                                    {
                                        id: "main_image",
                                        title: "Current Image",
                                        type: "image",
                                        imageSource: "teamGallery",
                                        customClass: "team-gallery-image",
                                    },
                                    {
                                        id: "gallery_image",
                                        title: "Image",
                                        type: "file"
                                    },
                                    {
                                        id: "gallery_image_id",
                                        title: "Hidden Id",
                                        type: "text",
                                        hidden: true,
                                    },

                                    {
                                        id: "gallery_image_hidden",
                                        title: "Image Value",
                                        type: "text",
                                        hidden: true,
                                    }
                                ],
                                dataProvider: {
                                    "title": "showTeamGalleryImages",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": REST_API_URLS.TEAM_GALLERY,
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "galleryDetails",
                                        "isGroup": true,
                                    },
                                    "parameters": [
                                        {
                                            id: "teamId",
                                            isMendatory: true,
                                            source: "route",
                                            sourceValue: "teamId"
                                        }
                                    ]
                                }
                            },
                        ]
                    }
                ],
                actions: [
                    {
                        title: "Update Team Gallery",
                        id: "updateTeamGallery",
                        type: "rest",
                        method: "fileUpload",
                        url: "",
                        dev_url: REST_API_URLS.UPDATE_TEAM_GALLERY,
                        sendAllParam: true,
                        doFileUpload: true,
                        responseHandler: {
                            type: "navigate",
                            actionInfo: {
                                "type": "url",
                                "title": "Gallery success",
                                "url": "./team-profile",
                                "parameters": [
                                    {
                                        "id": "teamId",
                                        "isMendatory": true
                                    }
                                ],
                            }
                        },
                        fileUploadFields: [
                            {
                                id: "galleryDetails",
                                isGroup: true,
                                groupFieldIds: ["gallery_image"]
                            },
                        ],
                        parameters: [
                            {
                                id: "userId",
                                isMendatory: false,
                                source: "system",
                                sourceValue: "userId"
                            },
                            {
                                id: "teamId",
                                isMendatory: false,
                                source: "route",
                                sourceValue: "teamId"
                            }
                        ]
                    }
                ]
            }
        }
    }
}

STATICWIDGETS["ADDTEAMGALLERY"] = {
    name: "form",
    title: "Add Team Gallery images",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add Gallery Images",
                rows: [
                    {
                        fields: [
                            {
                                id: "teamGallery",
                                title: "Add Gallery Images",
                                type: "file",
                            },
                        ]
                    }
                ],
                actions: [{
                    title: "Add Team Gallery",
                    id: "addTeamRoster",
                    type: "rest",
                    method: "fileUpload",
                    url: "",
                    dev_url: REST_API_URLS.ADD_TEAM_GALLERY,
                    sendAllParam: true,
                    doFileUpload: true,
                    fileUploadFields: [
                        {
                            id: "teamGallery"
                        },
                    ],
                    parameters: [
                        {
                            id: "userId",
                            isMendatory: false,
                            source: "system",
                            sourceValue: "userId"
                        },
                        {
                            id: "teamId",
                            isMendatory: false,
                            source: "route",
                            sourceValue: "teamId"
                        }
                    ]
                }
                ]
            }
        }
    }
}

STATICWIDGETS["ADDBRACKET"] = {
    name: "form",
    title: "Create bracket",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add bracket",
                rows: [
                    {
                        fields: [
                            {
                                id: "state",
                                title: "State",
                                type: "text",
                                readOnly: true,
                                customClass: "row-item-2"
                            },
                            {
                                id: "sportId",
                                title: "Sport",
                                type: "text",
                                readOnly: true,
                                customClass: "row-item-2"
                            },
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "startdate",
                                title: "Start Date",
                                type: "date",
                                customClass: "row-item-2"
                            },
                            {
                                id: "enddate",
                                title: "End Date",
                                type: "date",
                                customClass: "row-item-2"
                            },
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "numberofteams",
                                title: "Number of teams",
                                type: "number",
                                customClass: "row-item",
                                dependencyInfo: [
                                    {
                                        fieldId: "bracketScore",
                                        type: "dataReload"
                                    },
                                    {
                                        fieldId: "orderOfFinish",
                                        type: "addRows"
                                    },
                                    {
                                        fieldId: "teamDetails",
                                        type: "addRows"
                                    },
                                ]
                            },
                            {
                                id: "brackettypeid",
                                title: "Bracket type",
                                type: "dropdown",
                                customClass: "row-item",
                                dataProvider: {
                                    "title": "showAllBracketTypes",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllBracketTypes",
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "brackettypeid"
                                    }
                                },
                                dependencyInfo: [
                                    {
                                        fieldId: "bracketScore",
                                        type: "dataReload"
                                    }
                                ]
                            },
                            {
                                id: "directorId",
                                title: "Director",
                                type: "dropdown",
                                customClass: "row-item"
                            }]
                    },
                    {
                        fields: [
                            {
                                id: "parkName",
                                title: "Park name",
                                type: "dropdown",
                                customClass: "row-item-3",
                                dataProvider: {
                                    "title": "showTournamentParks",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadTournamentParks",
                                    "parameters": [
                                        {
                                            "id": "tournamentId",
                                            "isMendatory": true,
                                            "source": "route"
                                        },
                                        {
                                            "id": "columnToFetch",
                                            "isMendatory": true,
                                            "type": "inline",
                                            "default": ["id, parkName as title"]
                                        }
                                    ],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "parkName"
                                    },
                                }
                            },
                            {
                                id: "agegroup",
                                title: "Agegroup",
                                type: "dropdown",
                                dataProvider: {
                                    "title": "showTournamentAgegroups",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllAgegroupOfTournament",
                                    "parameters": [
                                        {
                                            "id": "tournamentId",
                                            "isMendatory": true,
                                            "source": "route"
                                        },
                                        {
                                            "id": "columnToFetch",
                                            "isMendatory": true,
                                            "type": "inline",
                                            "default": ["id, agegroup as title"]
                                        }

                                    ],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "agegroup"
                                    },
                                },
                                customClass: "row-item-3"
                            },
                            {
                                id: "classification",
                                title: "Classification",
                                type: "dropdown",
                                customClass: "row-item-3",
                                dataProvider: {
                                    "title": "showClassifications",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllClassificationOfTournament",
                                    "parameters": [
                                        {
                                            "id": "tournamentId",
                                            "isMendatory": true,
                                            "source": "route",
                                        }],
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "classification"
                                    },
                                }
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "poolplaytime",
                                title: "Pool play limit",
                                type: "text",
                                customClass: "row-item-2"
                            },
                            {
                                id: "bracketPlayLimit",
                                title: "Bracket play limit",
                                type: "text",
                                customClass: "row-item-2"
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "championshipgametime",
                                title: "Championship game time limit",
                                type: "text",
                                customClass: "row-item-2"
                            },
                            {
                                id: "ifgametime",
                                title: "If game time limit",
                                type: "text",
                                customClass: "row-item-2"
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "uicAccess",
                                title: "Select Umpire who can access",
                                type: "dropdown",
                                customClass: "row-item-2"
                            },
                            {
                                id: "officialAccess",
                                title: "Select official who can access",
                                type: "text",
                                customClass: "row-item-2"
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "add_info",
                                title: "Bracket info",
                                type: "text",
                                multiline: true,
                                customClass: "row-item-full"
                            }]
                    },
                    {
                        fields: [
                            {
                                id: "bracketScore",
                                title: "Bracket info",
                                type: "group",
                                customClass: "row-item-full",
                                editable: false,
                                labelOnHeadingOnly: true,
                                fields: [
                                    {
                                        id: "sNo",
                                        title: "",
                                        displayLabel: false,
                                        type: "label"
                                    },
                                    {
                                        id: "game_day",
                                        title: "Day",
                                        type: "text"
                                    },
                                    {
                                        id: "game_time",
                                        title: "Time",
                                        type: "text"
                                    },
                                    {
                                        id: "game_field",
                                        title: "Field",
                                        type: "text"
                                    },
                                    {
                                        id: "team1id",
                                        title: "Team1",
                                        type: "dropdown"
                                    },
                                    {
                                        id: "team1_score",
                                        title: "Score",
                                        type: "number"
                                    },
                                    {
                                        id: "team2id",
                                        title: "Team2",
                                        type: "dropdown"
                                    },
                                    {
                                        id: "team2_score",
                                        title: "Score",
                                        type: "number"
                                    }
                                ],
                                dataProvider: {
                                    "title": "showBracketMatches",
                                    "type": "rest",
                                    "method": "get",
                                    "url": "",
                                    "dev_url": "http://gsaserver.technideus.com/public/loadAllBracketMatches",
                                    "transformationType": "RAW",
                                    "otherDetails": {
                                        "fieldId": "bracketScore",
                                        "isGroup": true,
                                    },
                                    "parameters": [
                                        {
                                            id: "numberofteams",
                                            isMendatory: true,
                                        },
                                        {
                                            id: "brackettypeid",
                                            isMendatory: true
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "teamDetails",
                                type: "group",
                                customClass: "row-item-2",
                                editable: false,
                                fields: [
                                    {
                                        id: "sNo",
                                        displayLabel: false,
                                    },
                                    {
                                        id: "teamId",
                                        type: "dropdown",
                                        dataProvider: {
                                            "title": "showTournametTeams",
                                            "type": "rest",
                                            "method": "get",
                                            "url": "",
                                            "dev_url": "http://gsaserver.technideus.com/public/loadTournamentTeams",
                                            "transformationType": "RAW",
                                            "otherDetails": {
                                                "fieldId": "teamId"
                                            },
                                            "parameters": [
                                                {
                                                    id: "tournamentId",
                                                    source: "route",
                                                    isMendatory: true
                                                }
                                            ]
                                        },
                                        dependencyInfo: [
                                            {
                                                fieldId: "teamIds",
                                                isGroup: "true",
                                                sourceGroup: "teamDetails",
                                                groupField: "orderOfFinish",
                                                type: "bracketTeamFilling",
                                                bracketFieldIds: ["teamIds"],
                                            },
                                            {
                                                fieldId: "team1id",
                                                isGroup: "true",
                                                sourceGroup: "teamDetails",
                                                groupField: "bracketScore",
                                                type: "bracketTeamFilling",
                                                bracketFieldIds: ["team1id", "team2id"]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "orderOfFinish",
                                type: "group",
                                customClass: "row-item-2",
                                editable: false,
                                fields: [
                                    {
                                        id: "teamIds",
                                        type: "dropdown",
                                        dataProvider: {
                                            "title": "showTournametTeams",
                                            "type": "rest",
                                            "method": "get",
                                            "url": "",
                                            "dev_url": "http://gsaserver.technideus.com/public/loadTournamentTeams",
                                            "transformationType": "RAW",
                                            "otherDetails": {
                                                "fieldId": "teamIds"
                                            },
                                            "parameters": [
                                                {
                                                    id: "tournamentId",
                                                    source: "route",
                                                    isMendatory: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: "win",
                                        title: "Win",
                                        type: "number",

                                    },
                                    {
                                        id: "loss",
                                        title: "Loss",
                                        type: "number",

                                    },
                                    {
                                        id: "tie",
                                        title: "Tie",
                                        type: "number",

                                    },
                                ]
                            }
                        ]
                    },
                    {
                        fields: [
                            {
                                id: "add_footer_info",
                                title: "Footer info",
                                type: "text",
                                multiline: true,
                                customClass: "row-item-full"
                            }]
                    }],
                actions: [
                    {
                        title: "Save Bracket",
                        id: "addBracket",
                        type: "rest",
                        method: "post",
                        url: "",
                        dev_url: "http://gsaserver.technideus.com/public/saveBracket",
                        sendAllParam: true,
                        parameters: [
                            {
                                id: "tournamentId",
                                isMendatory: true,
                                source: "route",
                                sourceValue: "tournamentId"
                            }
                        ]
                    },
                    {
                        title: "Save & submit to rankings",
                        id: "addTeam",
                        type: "rest",
                        method: "post",
                        url: "",
                        dev_url: "http://gsaserver.technideus.com/public/saveBracket",
                        sendAllParam: true,
                        parameters: [
                            {
                                id: "submit_to_rankings",
                                isMendatory: true,
                                default: 1,
                            },
                            {
                                id: "tournamentId",
                                isMendatory: true,
                                source: "route",
                                sourceValue: "tournamentId"
                            }
                        ]
                    }
                ]
            },
            formConfig: {
                customClass: "app-bracket-form"
            },
            formDataProvider: {
                "title": "showBracketDetails",
                "type": "rest",
                "method": "get",
                "url": "",
                "dev_url": "http://gsaserver.technideus.com/public/loadBracketDetails",
                "parameters": [
                    {
                        "id": "tournamentId",
                        "isMendatory": true,
                        "source": "route",
                    },
                    {
                        "id": "bracketId",
                        "isMendatory": false,
                        "source": "route",
                        "sourceValue": "bracketId"
                    }
                ],
                "transformationType": "RAW"
            }
        }
    }
}

STATICWIDGETS["EDITBRACKET"] = {
    name: "form",
    title: "Create bracket",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Add bracket",
                rows: STATICWIDGETS['ADDBRACKET'].dataProvider.data.schema.rows,
                actions: [
                    {
                        title: "Save Bracket",
                        id: "addBracket",
                        type: "rest",
                        method: "post",
                        url: "",
                        dev_url: "http://gsaserver.technideus.com/public/saveBracket",
                        sendAllParam: true,
                        parameters: [
                            {
                                id: "tournamentId",
                                isMendatory: true,
                                source: "route",
                                sourceValue: "tournamentId"
                            },
                            {
                                id: "bracketId",
                                isMendatory: true,
                                source: "route",
                                sourceValue: "bracketId"
                            },
                            {
                                id: "requestFor",
                                isMendatory: true,
                                default: "EDIT",
                            }
                        ]
                    },
                    {
                        title: "Save & submit to rankings",
                        id: "addTeam",
                        type: "rest",
                        method: "post",
                        url: "",
                        dev_url: "http://gsaserver.technideus.com/public/saveBracket",
                        sendAllParam: true,
                        parameters: [
                            {
                                id: "submit_to_rankings",
                                isMendatory: true,
                                default: 1,
                            },
                            {
                                id: "tournamentId",
                                isMendatory: true,
                                source: "route",
                                sourceValue: "tournamentId"
                            },
                            {
                                id: "bracketId",
                                isMendatory: true,
                                source: "route",
                                sourceValue: "bracketId"
                            },
                            {
                                id: "requestFor",
                                isMendatory: true,
                                default: "EDIT",
                            }
                        ]
                    }
                ]
            },
            formConfig: {
                customClass: "app-bracket-form"
            },
            formDataProvider: {
                "title": "showBracketDetails",
                "type": "rest",
                "method": "get",
                "url": "",
                "dev_url": "http://gsaserver.technideus.com/public/loadBracketScores",
                "parameters": [
                    {
                        "id": "tournamentId",
                        "isMendatory": true,
                        "source": "route",
                    },
                    {
                        "id": "bracketId",
                        "isMendatory": true,
                        "source": "route",
                        "sourceValue": "bracketId"
                    }
                ],
                "transformationType": "RAW"
            }
        }
    }
}


STATICWIDGETS["REGISTERTOURNAMENTUNKNOWN"] = [
    {
        name: "form",
        title: "Register for tournament",
        dataProvider: {
            type: "INLINE",
            data: {
                schema: {
                    fields: [
                        {
                            id: "search-by-email",
                            title: "User name",
                            type: "plainText",
                            route: true,
                            routerLink: "./register-by-email",
                            subType: "route",
                            text: Constants.REGISTER_FOR_TOURNAMENT_SEARCH_EMAIL,
                        },
                        {
                            id: "search-by-email-desc",
                            title: "User name",
                            type: "plainText",
                            text: Constants.REGISTER_FOR_TOURNAMENT_SEARCH_EMAIL_DESC
                        },
                        {
                            id: "search-by-email-or",
                            title: "User name",
                            type: "plainText",
                            text: "OR",
                        }
                    ]
                }
            }
        },
        widgetConfig: {
            showHeader: false,
            customClass: "center-align-content"
        }
    },
    {
        name: "form",
        title: "Register for tournament",
        dataProvider: {
            type: "INLINE",
            data: {
                schema: {
                    fields: [
                        {
                            id: "create-team",
                            title: "User name",
                            type: "plainText",
                            route: true,
                            routerLink: "./add-team",
                            subType: "route",
                            text: Constants.REGISTER_FOR_TOURNAMENT_CREATE_TEAM,
                        },
                        {
                            id: "create-team-desc",
                            title: "User name",
                            type: "plainText",
                            text: Constants.REGISTER_FOR_TOURNAMENT_CREATE_TEAM_DESC
                        },
                        {
                            id: "create-team-or",
                            title: "User name",
                            type: "plainText",
                            text: "OR",
                        }
                    ]
                }
            }
        },
        widgetConfig: {
            showHeader: false,
            customClass: "center-align-content"
        }
    },
    {
        name: "form",
        title: "Login below",
        dataProvider: STATICWIDGETS["LOGIN"].dataProvider,
        widgetConfig: {
            showHeader: false,
            customClass: "center-align-content"
        }
    },

];

STATICWIDGETS["TOURNAMENTREGISTRATION"] = {
    name: "form",
    title: "Register for tournament",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Sign In",
                fields: [
                    {
                        id: "teamId",
                        title: "Select your team",
                        type: "dropdown",
                        dataProvider: {
                            title: "Fetch user teams",
                            type: "rest",
                            method: "get",
                            url: "",
                            dev_url: "http://gsaserver.technideus.com/public/teamOptions",
                            sendAllParam: true,
                            transformationType: "RAW",
                            parameters: [
                                {
                                    id: "memberid",
                                    isMendatory: true,
                                    source: "system",
                                    sourceValue: "userId"
                                },
                                {
                                    id: "permissions",
                                    isMendatory: true,
                                    default: 1,
                                }
                            ],
                            otherDetails: {
                                fieldId: "teamId",
                            }
                        },
                        dependencyInfo: [
                            {
                                fieldId: "team_primary",
                                type: "dataReload",
                            },
                            {
                                fieldId: "team_email",
                                type: "dataReload",
                            },
                        ]
                    },
                    {
                        id: "team_primary",
                        title: "Primary",
                        type: "text",
                        dataProvider: {
                            title: "Fetch team column",
                            type: "rest",
                            method: "get",
                            url: "",
                            dev_url: "http://gsaserver.technideus.com/public/loadTeamDetail",
                            sendAllParam: true,
                            transformationType: "RAW",
                            parameters: [
                                {
                                    id: "teamId",
                                    isMendatory: true,
                                },
                                {
                                    "id": "columnToFetch",
                                    "isMendatory": true,
                                    "type": "inline",
                                    "default": ["team_primary"]
                                }
                            ],
                            otherDetails: {
                                fieldId: "team_primary",
                            }
                        }
                    },
                    {
                        id: "team_email",
                        title: "Email",
                        type: "text",
                        dataProvider: {
                            title: "Fetch team column",
                            type: "rest",
                            method: "get",
                            url: "",
                            dev_url: "http://gsaserver.technideus.com/public/loadTeamDetail",
                            sendAllParam: true,
                            transformationType: "RAW",
                            parameters: [
                                {
                                    id: "teamId",
                                    isMendatory: true,
                                },
                                {
                                    "id": "columnToFetch",
                                    "isMendatory": true,
                                    "type": "inline",
                                    "default": ["email"]
                                }
                            ],
                            otherDetails: {
                                fieldId: "team_email",
                            }
                        }
                    }
                ],
                actions: [{
                    title: "Register",
                    id: "updateTeamCommunicationDetails",
                    type: "rest",
                    method: "get",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/updateTeamDetails",
                    sendAllParam: true,
                    parameters: [
                        {
                            id: "teamId",
                            isMendatory: true
                        }
                    ],
                    responseHandler: {
                        type: "navigate",
                        actionInfo: {
                            "type": "url",
                            "title": "Add New",
                            "url": "./tournament-register-confirm",
                            "parameters": [
                                {
                                    "id": "teamId",
                                    "isMendatory": true
                                }
                            ],
                        }
                    }
                }]
            }
        }
    },
    widgetConfig: {
        showHeader: false,
    }
};

STATICWIDGETS["TOURNAMENTREGISTERCONFIRM"] = {
    name: "form",
    title: "Register for tournament",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Confirm registration",
                fields: [
                    {
                        id: "teamId",
                        title: "Team",
                        type: "dropdown",
                        dataProvider: {
                            title: "Fetch user teams",
                            type: "rest",
                            method: "get",
                            url: "",
                            dev_url: "http://gsaserver.technideus.com/public/teamOptions",
                            sendAllParam: true,
                            transformationType: "RAW",
                            parameters: [
                                {
                                    id: "memberid",
                                    isMendatory: true,
                                    source: "system",
                                    sourceValue: "userId"
                                },
                                {
                                    id: "permissions",
                                    isMendatory: true,
                                    default: 1,
                                }
                            ],
                            otherDetails: {
                                fieldId: "teamId",
                            }
                        },
                        dependencyInfo: [
                            {
                                fieldId: "team_primary",
                                type: "dataReload",
                            },
                            {
                                fieldId: "team_email",
                                type: "dataReload",
                            },
                        ]
                    },
                    {
                        id: "team_primary",
                        title: "Primary",
                        type: "text",
                        dataProvider: {
                            title: "Fetch team column",
                            type: "rest",
                            method: "get",
                            url: "",
                            dev_url: "http://gsaserver.technideus.com/public/loadTeamDetail",
                            sendAllParam: true,
                            transformationType: "RAW",
                            parameters: [
                                {
                                    id: "teamId",
                                    isMendatory: true,
                                },
                                {
                                    "id": "columnToFetch",
                                    "isMendatory": true,
                                    "type": "inline",
                                    "default": ["team_primary"]
                                }
                            ],
                            otherDetails: {
                                fieldId: "team_primary",
                            }
                        }
                    },
                    {
                        id: "team_email",
                        title: "Email",
                        type: "text",
                        dataProvider: {
                            title: "Fetch team column",
                            type: "rest",
                            method: "get",
                            url: "",
                            dev_url: "http://gsaserver.technideus.com/public/loadTeamDetail",
                            sendAllParam: true,
                            transformationType: "RAW",
                            parameters: [
                                {
                                    id: "teamId",
                                    isMendatory: true,
                                },
                                {
                                    "id": "columnToFetch",
                                    "isMendatory": true,
                                    "type": "inline",
                                    "default": ["email"]
                                }
                            ],
                            otherDetails: {
                                fieldId: "team_email",
                            }
                        }
                    }
                ],
                actions: [{
                    title: "Register",
                    id: "registerForTournament",
                    type: "rest",
                    method: "post",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/registerForTournament",
                    sendAllParam: true,
                    parameters: [
                        {
                            id: "tournamentId",
                            isMendatory: true,
                            source: "route",
                            sourceValue: "tournamentId",
                        }
                    ],
                    responseHandler: {
                        type: "navigate",
                        actionInfo: {
                            "type": "url",
                            "title": "Tournament profile page",
                            "url": "./who-is-playing",
                            "parameters": [
                                {
                                    "id": "tournamentId",
                                    "isMendatory": true
                                }
                            ],
                        }
                    }
                }]
            }
        }
    },
    widgetConfig: {
        showHeader: false,
    }
};

STATICWIDGETS["REGISTERBYEMAIL"] = {
    name: "form",
    title: "Email team search",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "Sign In",
                fields: [
                    {
                        id: "heading",
                        title: "Heading",
                        type: "plainText",
                        text: Constants.PROVIDE_EMAIL_FOR_REGISTRATION,
                    },
                    {
                        id: "search_email",
                        title: "Email",
                        type: "text"
                    }
                ],
                actions: [{
                    title: "Search Team",
                    id: "searchteam",
                    type: "rest",
                    method: "get",
                    url: "",
                    dev_url: "http://gsaserver.technideus.com/public/teamOptions",
                    transformationType: "RAW",
                    parameters: [
                        {
                            id: "search_email",
                            isMendatory: true
                        },
                        {
                            id: "permission",
                            isMendatory: true,
                            default: 1,
                        }
                    ],
                    responseHandler: {
                        type: "widgetLoad",
                        widgetInfoList: [
                            {
                                widget: STATICWIDGETS["TOURNAMENTREGISTRATION"],
                                dataAction: "loadDataInField",
                                fieldId: "teamId",
                            }
                        ]

                    }
                }]
            }
        }
    },
    widgetConfig: {
        showHeader: false,
    }
};


STATICWIDGETS["TOURNAMENTRECORDHEADINGONTEAM"] = {
    name: "form",
    title: "Single tournament record",
    dataProvider: {
        type: "INLINE",
        data: {
            schema: {
                title: "View Tournament record",
                rows: [
                    {
                        fields: [
                            {
                                id: "tournament_record_heading",
                                type: "plainText",
                                text: Constants.TEAM_PROFILE_RECORD.TEAM_SINGLE_TOURNAMENT_RECORD,
                            }
                        ]
                    }
                ],
            },
            formConfig: {
                submitOnLoad: true,
            },
        }
    },
    widgetConfig: {
        showHeader: true,
        isPlainWidget: true
    },
    "metaType": "tournament-record"
};

STATICWIDGETS["SINGLETOURNAMENTRECORD"] = {
    name: "richTable",
    title: "Our Tournament Records",
    dataProvider: {
        title: "Team profile info",
        type: "REST",
        url: "",
        method: "get",
        dev_url: REST_API_URLS.TEAM_TOURNAMENT_RESULT,
        parameters: [
            {
                id: "teamId",
                isMendatory: true,
                source: "route",
                sourceValue: "teamId"
            }
        ]
    },
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true
    },
    metaType: "single-tournament-ranking",
};

STATICWIDGETS["TOURNAMENTBRACKETDETAIL"] = {
    name: "keyValue",
    title: "Tournament Bracket Details",
    dataProvider: {
        title: "Bracketinfo",
        type: "REST",
        url: "",
        method: "get",
        dev_url: REST_API_URLS.TEAM_TOURNAMENT_BRACKET_DETAIL,
        parameters: [
            {
                id: "teamId",
                isMendatory: true,
                source: "route",
                sourceValue: "teamId",
            },
            {
                id: "tournamentId",
                isMendatory: true
            }
        ]
    },
    widgetConfig: {
        showHeader: false,
    },
    metaType: "tournament-bracket",
};

STATICWIDGETS["TOURNAMENTBRACKETSCOREOFTEAM"] = {
    name: "richTable",
    title: "Tournament Bracket Score Details",
    dataProvider: {
        title: "BracketScoreinfo",
        type: "REST",
        url: "",
        method: "get",
        dev_url: REST_API_URLS.TEAM_TOURNAMENT_BRACKET_SCORE,
        parameters: [
            {
                id: "teamId",
                isMendatory: true,
                source: "route",
                sourceValue: "teamId",
            },
            {
                id: "tournamentId",
                isMendatory: true
            }
        ]
    },
    widgetConfig: {
        showHeader: false,
    },
    metaType: "tournament-bracket-score",
};

STATICWIDGETS["TEAMPROFILE"] = {
    name: "teamProfile",
    title: "Plain Table",
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true,
    },
    dataProvider: TeamProfileAction
}

STATICWIDGETS["VIEWBRACKET"] = {
    name: "viewBracket",
    title: "View Bracket Details",
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true,
    },
    dataProvider: ViewBracketAction
}

STATICWIDGETS["USERPROFILE"] = {
    name: "userProfile",
    title: "Plain Table",
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true,
    },
    dataProvider: UserProfileAction,
    metaType: "user"
}

STATICWIDGETS["TOURNAMENTPROFILE"] = {
    name: "tournamentProfile",
    title: "Plain Table",
    widgetConfig: {
        showHeader: false,
        isPlainWidget: true,
    },
    dataProvider: TournamentProfileAction
}

