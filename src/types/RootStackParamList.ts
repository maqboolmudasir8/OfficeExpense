export type RootStackParamList = {
    Signup: undefined;
    Login: undefined;
    Home: undefined;
    GroupList: undefined;
    ExpenseList: {
        groupId: number;
        // groupName: string
    };

    AddGroup: undefined;
    GroupDetail: { groupId: number };

    ExpenseGroupList: undefined;
    CreateExpenseGroup: undefined;

    ExpenseGroupDetails: { groupId: number };
    ExpenseGroupMembers: { groupId: number };

    AddMember: { groupId: number }; // <-- add this if you have an AddMember screen

    // Navigation containers
    MainTabs: undefined;
};