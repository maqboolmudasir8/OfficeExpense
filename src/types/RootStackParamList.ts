export type RootStackParamList = {
    Signup: undefined;
    Login: undefined;
    Home: undefined;

    // Navigation containers
    MainTabs: undefined;


    // Profile
    Profile: undefined;
    EditProfile: undefined;

    // Folders
    FoldersList: undefined;
    CreateFolderScreen: undefined;
    FolderDetails: { folderId: number };



    // Files
    FilesTab: undefined; // temp
    FileDetail: {
        fileId: number
        folderId: number
    };

    AddExpense: {
        fileId: number
        folderId: number
    };


    AddFileMember: { fileId: number };


    GroupList: undefined;

    AddGroup: undefined;
    GroupDetail: { groupId: number };


    ExpenseGroupMembers: { groupId: number };

    AddMember: { groupId: number }; // <-- add this if you have an AddMember screen




    // Expenses
    // ExpenseList: { groupId?: number };
    EditExpense: {
        expenseId: number
        fileId: number
    };
    ExpenseDetail: { expenseId: number };
};