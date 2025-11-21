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
};