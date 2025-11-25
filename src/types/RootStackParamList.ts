export type RootStackParamList = {
    Signup: undefined;
    Login: undefined;
    Home: undefined;

    FoldersList: undefined;
    FolderDetails: { groupId: number };




    FilesTab: undefined; // temp
    FileDetail: { fileId: number };
    AddFileMember: { fileId: number };





    CreateExpenseGroup: undefined;







    GroupList: undefined;
    // ExpenseList: {
    //     groupId: number;
    //     // groupName: string
    // };

    AddGroup: undefined;
    GroupDetail: { groupId: number };


    ExpenseGroupMembers: { groupId: number };

    AddMember: { groupId: number }; // <-- add this if you have an AddMember screen

    // Navigation containers
    MainTabs: undefined;


    // ExpenseList: { groupId: number | undefined };
    // AddExpense: { groupId: number | undefined };
    ExpenseList: { groupId?: number };
    AddExpense: { fileId?: number };
    EditExpense: { 
        expenseId: number
        fileId: number
     };
    ExpenseDetail: { expenseId: number };
};