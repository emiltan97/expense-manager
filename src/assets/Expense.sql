CREATE TABLE IF NOT EXISTS AccountType
(
AccountTypeID INTEGER PRIMARY KEY AUTOINCREMENT, 
AccountTypeName TEXT
);
INSERT or IGNORE INTO AccountType VALUES(1, "Bank");
INSERT or IGNORE INTO AccountType VALUES(2, "Cash");

CREATE TABLE IF NOT EXISTS Account
(
AccountID INTEGER PRIMARY KEY AUTOINCREMENT,
AccountName TEXT,
StartingBalance REAL, 
CurrentBalance REAL,
CreatedDate NUMERIC,
AccountTypeID INTEGER,
CONSTRAINT fk_Account_AccountTypeID FOREIGN KEY (AccountTypeID)
REFERENCES AccountType(AccountTypeID)
);

CREATE TABLE IF NOT EXISTS TransactionType
(
TransactionTypeID INTEGER PRIMARY KEY AUTOINCREMENT, 
TransactionTypeName TEXT
);
INSERT or IGNORE INTO TransactionType VALUES(1, "Income");
INSERT or IGNORE INTO TransactionType VALUES(2, "Expense");
INSERT or IGNORE INTO TransactionType VALUES(3, "Transfer");

CREATE TABLE IF NOT EXISTS Transactions
(
TransactionID INTEGER PRIMARY KEY AUTOINCREMENT, 
TransactionName TEXT, 
TransactionAmount REAL, 
TransactionDate NUMERIC,
TransactionTypeID INTEGER, 
AccountID INTEGER, 
CONSTRAINT fk_Transaction_TransactionTypeID FOREIGN KEY (TransactionTypeID) REFERENCES TransactionType(TransactionTypeID), 
CONSTRAINT fk_Transaction_AccountID FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
);
