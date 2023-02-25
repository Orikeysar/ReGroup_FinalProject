export  const defultAchievementList=
[
    {
        name : "Asist Friend",
        AchievementImg:"",
        levelOne: {
           topUse:20
        },
        levelTwo: {
           topUse:80
        },
        levelThree: {
           topUse:200
        },

    },
    {
        name : "Open Groups",
        numberOfAchievementDoing:2,
        AchievementImg:"",
        activeLevel:1,
        levelOne: {
          
           levelDone: "false",
           progresslevelOne :10,
           topUse:5
        },
        levelTwo: {
           
           levelDone: "false",
           progresslevelTwo :0,
           topUse:20
        },
        levelThree: {
          
           levelDone: "false",
           progresslevelThree :0,
           topUse:100
        },

    },
    {
        name : "Helped Answered",
        numberOfAchievementDoing:10,
        AchievementImg:"",
        activeLevel:2,
        levelOne: {           
           levelDone: "true",              
           topUse:10
        },
        levelTwo: {
           levelDone: "false",
           topUse:20
        },
        levelThree: {   
           levelDone: "false",
           topUse:100
        },
       

    },
    {
        name : "Love From Community",
        numberOfAchievementDoing:200,
        AchievementImg:"",
        activeLevel:3,
        levelOne: {
           levelDone: "true",
          
           topUse:10
        },
        levelTwo: {
           levelDone: "true",
           topUse:50
        },
        levelThree: {
           levelDone: "true",
           topUse:100
        },

    },
   
]


//דוגמא ליוזר מחובר 
export  const userDataTest={
    id:"iaBSF783223D3F",
    name: "Gal Binyamin",
    email: "galbb6@gmail.com",
    degree: "",
    curses:{},
    firstLogIn: true,
    userImg:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
    recentActivities:[
        {
            timeStamp : "22.02.2023",
            type :"general",
            icon : "<FaUserFriends/>",
            text :"Congrats you and Omer now friends"

        },
        {
            timeStamp : "20.02.2023",
            type :"general",
            icon : "<FaHandshake/>",
            text :"You helped Chen Sela ! "

        },
        {
            timeStamp : "23.02.2023",
            type :"groups",
            curse : "Simulation",
            subjects:[
                {name : "object" },
                {name : "object" },
            ],
            text :"Routing and Stations examples"

        },
        {
            timeStamp : "19.02.2023",
            type :"groups",
            curse : "c#",
            subjects:[
                {name : "object" },
                {name : "object" },
                {name : "object" },
            ],
            text :"Create and work with DataTables"

        },
        {
            timeStamp : "01.02.2023",
            type :"general",
            icon : "<BiLike/>",
            text :"You got like from Gal on your answer"

        },
        {
            timeStamp : "01.02.2023",
            type :"groups",
            curse : "FrontEnd",
            subjects:[
                {name : "object" },
            ],
            text :"How to use Json files in JS"

        },
    ],
    achievementList:[
        {
            name : "Asist Friend",
            numberOfAchievementDoing:5,
            AchievementImg:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
            activeLevel:1,
            currentTopUse:20,
            levelOne: {
               topUse:20
            },
            levelTwo: {
               topUse:80
            },
            levelThree: {
               
               topUse:200
            },

        },
        {
            name : "Open Groups",
            numberOfAchievementDoing:2,
            AchievementImg:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
            activeLevel:1,
            currentTopUse:5,
            levelOne: {
               topUse:5
            },
            levelTwo: {
               topUse:20
            },
            levelThree: {
               topUse:100
            },

        },
        {
            name : "Helped Answered",
            numberOfAchievementDoing:10,
            AchievementImg:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
            activeLevel:2,
            currentTopUse:20,
            levelOne: {                       
               topUse:10
            },
            levelTwo: {
               topUse:20
            },
            levelThree: {   
               topUse:100
            },
           

        },
        {
            name : "Love From Community",
            numberOfAchievementDoing:200,
            AchievementImg:"https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
            activeLevel:3,
            currentTopUse:100,
            levelOne: {
               topUse:10
            },
            levelTwo: {
               topUse:50
            },
            levelThree: {
               topUse:100
            },

        },
       
    ]


} 
