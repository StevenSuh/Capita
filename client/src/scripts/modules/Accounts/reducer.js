import Immutable from "immutable";

import * as defs from "./defs";

export const initialState = Immutable.fromJS({
  [defs.PROP_ACCOUNTS]: [
    {
      id: 1,
      userId: 1,
      institutionLinkId: 2,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceIsoCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionName: "Bank of America",
      institutionLogo:
        "data:image/png;base64,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",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      institutionLinkId: 1,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceIsoCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionName: "Chase",
      institutionLogo:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAMAAAAvHNATAAAANlBMVEVHcEwOW6f///8IVqUPW6gQXKgRXKkPW6gTYKwPW6gbYqsxcbJ3ocza5vDs8/b0+Pmlwt1Vir96WNmQAAAACnRSTlMA////5HhLoCDGuAtrFAAABQNJREFUeNrt3H9vpCAQBuACIuC6wn7/L3vuXttb8UX5MdjJpVya3D9tngDiqDPz8dE67KiNcc4NgxDDsP7HGD3aj58cVhu3avAYnNE/wbOjSZredObauctCveGuWsAC1aet/6Ja7UTVcF1t1oiGYSxLVjdaO6sLjYZFT9OTIBuTpju2nCAdbmS2irTrOQ6iwxiaJ02LTqNtp9n07lJT7kjtNNtjGdUt3JfMMSvq5Uwvo3osMn+kZLXLaTDp9jyL7rJkBJGgGTKXeCw3teqKXH6VCTKZw/Pl/RM2y8KRnDNHcjk+t1YdTIZJUVycdsCX4rrlK2Fp2WBb11Hcnlu+FibvU/tq4nV8uaphXt5vrTJz4KqfMemTMtNyTny6GmBStsnwef99pLbA5JKSZdwDRnzH/j7qm2ByeSRkY9VBoaYgKWA+LTs9NNAFqUSQkmbG1t9PyFzNBguSDiZ9ItjQxRts42qHJWVj6QYLkhaWCtAOtpk5d5HAEjJTtJCxgQSWCNDG/CtyT6CB4QDNZV+RQEAEwzJ4ZdoJBazdYDBAm2zWzkcuOhgM0MD+t3kuQphHMns+YYlnRzoYDNDM6YS9Avy+MBig2bMJS7hoYUBmjifsK5DuDQNhkD2asLSLGuZ3MnMwYQcuahiYM5s+9NdA2l8G24WOOnWXVIfvcuhhcYDmEiv5HuBfA4vDIAtX8uXyJ7DHnXg88FoOyUAaw8REPjahLAwQg8yArSFL0b+/v5L8UYmA0aQD6RSs7zC7lVx3te8CU2dDgLW04A0FMWwKx2OO/qiNt1gnmLqdrUP0MWCMt1g32FJ2/Jv4sPg5mAwq3mRWsIDdp3iTaY4wHYVibGAmiizYwFx0o2QDe+5+wREmoliMD8xuQws+sHEb7vOB6e2DGx+Y4QtzPGHuF1YMG3jCBr4wwRMm+MJ+91gp7Pcc+29gv9FFKYxtoMg2tGb7MML28Y3vAy/bVwRsX6qwfQ3F9sUdk1edG9jA5+XwFmbi1+mKCWyMP0BkfO+7BGb3H98CB9gAvtRP890fjqUTbJn2H7m2eWPT7XjUfOLK+DLyPmMj/JAqSr6TkcHeM0OG/jU+2bDNBtHwY70iHxmwbe6FRekN6jETj+fH/RPY1uVwQsitrIAmK3XhBBZlhGicQnOSdtEBFmeq2FTSEbHsDBYnEpuDNK1wHczvknXtUWJbuG7GZnWcC7hN71HhKtiszrInzVY2XwML6jTf1J7kWHeBhdPcSZANOPvusH1as8lIacb5uZSwkJfSvLuVE8mSMJBsrfPS5svqTkthwOVyCw1IZBDmYQr4mFuaoRTBLR3PWGZqerKYhUAGYagK7qhmahT0MgSD1XljWcFUswzAoEuXlpg9AzRPCoNPgK6iKK8tQNvBYF3eeSXvKIhlMQzXC45VhZ+qJUCLYLhaUNeWyjYEaFsYdjUU8dbLtrC5wYVrzapDx3cYrmBsLRSf606Nd1irK1FoObfCoGsoa0YAa3mrArR/sADnq7SDCZYtDbDQuo5H12aF7AsG6xapWoSoCtknDNagVrnw+7zyYOMF87DdRXXvHtgep1D2Kn65IVdLtyN0cRbO2WvLT8Dl2vpD6TbZkuw/09zsCyynmkrec8IxEHT6svDqzH8zDK9GmrZt1Y3RUj1U6Do+Mm0lx7j5Ht92hYwbPDJuicm4iSjjtqucG9Vybu37vagMmyG/z12X9tF/APITr9CCbDsMAAAAAElFTkSuQmCC",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      institutionLinkId: 2,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceIsoCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionName: "Bank of America",
      institutionLogo:
        "data:image/png;base64,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",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      userId: 1,
      institutionLinkId: 1,
      plaidAccountId: "account-1",
      active: true,
      mask: "4444",
      name: "Checking",
      officialName: "Bank of America Checking",
      subtype: "checking",
      type: "depository",
      verificationStatus: "automatically_verified",
      balanceAvailable: null || 100.42,
      balanceCurrent: 120.0,
      balanceLimit: null,
      balanceIsoCurrencyCode: "USD",
      balanceUnofficialCurrencyCode: null,
      apy: 0.02,
      withdrawalLimit: null,
      minimumBalance: null,
      notificationEnabled: true,
      transactionAlertEnabled: true,
      withdrawalLimitAlertEnabled: true,
      minimumBalanceAlertEnabled: true,
      creditLimitAlertEnabled: true,
      institutionName: "Chase",
      institutionLogo:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAMAAAAvHNATAAAANlBMVEVHcEwOW6f///8IVqUPW6gQXKgRXKkPW6gTYKwPW6gbYqsxcbJ3ocza5vDs8/b0+Pmlwt1Vir96WNmQAAAACnRSTlMA////5HhLoCDGuAtrFAAABQNJREFUeNrt3H9vpCAQBuACIuC6wn7/L3vuXttb8UX5MdjJpVya3D9tngDiqDPz8dE67KiNcc4NgxDDsP7HGD3aj58cVhu3avAYnNE/wbOjSZredObauctCveGuWsAC1aet/6Ja7UTVcF1t1oiGYSxLVjdaO6sLjYZFT9OTIBuTpju2nCAdbmS2irTrOQ6iwxiaJ02LTqNtp9n07lJT7kjtNNtjGdUt3JfMMSvq5Uwvo3osMn+kZLXLaTDp9jyL7rJkBJGgGTKXeCw3teqKXH6VCTKZw/Pl/RM2y8KRnDNHcjk+t1YdTIZJUVycdsCX4rrlK2Fp2WBb11Hcnlu+FibvU/tq4nV8uaphXt5vrTJz4KqfMemTMtNyTny6GmBStsnwef99pLbA5JKSZdwDRnzH/j7qm2ByeSRkY9VBoaYgKWA+LTs9NNAFqUSQkmbG1t9PyFzNBguSDiZ9ItjQxRts42qHJWVj6QYLkhaWCtAOtpk5d5HAEjJTtJCxgQSWCNDG/CtyT6CB4QDNZV+RQEAEwzJ4ZdoJBazdYDBAm2zWzkcuOhgM0MD+t3kuQphHMns+YYlnRzoYDNDM6YS9Avy+MBig2bMJS7hoYUBmjifsK5DuDQNhkD2asLSLGuZ3MnMwYQcuahiYM5s+9NdA2l8G24WOOnWXVIfvcuhhcYDmEiv5HuBfA4vDIAtX8uXyJ7DHnXg88FoOyUAaw8REPjahLAwQg8yArSFL0b+/v5L8UYmA0aQD6RSs7zC7lVx3te8CU2dDgLW04A0FMWwKx2OO/qiNt1gnmLqdrUP0MWCMt1g32FJ2/Jv4sPg5mAwq3mRWsIDdp3iTaY4wHYVibGAmiizYwFx0o2QDe+5+wREmoliMD8xuQws+sHEb7vOB6e2DGx+Y4QtzPGHuF1YMG3jCBr4wwRMm+MJ+91gp7Pcc+29gv9FFKYxtoMg2tGb7MML28Y3vAy/bVwRsX6qwfQ3F9sUdk1edG9jA5+XwFmbi1+mKCWyMP0BkfO+7BGb3H98CB9gAvtRP890fjqUTbJn2H7m2eWPT7XjUfOLK+DLyPmMj/JAqSr6TkcHeM0OG/jU+2bDNBtHwY70iHxmwbe6FRekN6jETj+fH/RPY1uVwQsitrIAmK3XhBBZlhGicQnOSdtEBFmeq2FTSEbHsDBYnEpuDNK1wHczvknXtUWJbuG7GZnWcC7hN71HhKtiszrInzVY2XwML6jTf1J7kWHeBhdPcSZANOPvusH1as8lIacb5uZSwkJfSvLuVE8mSMJBsrfPS5svqTkthwOVyCw1IZBDmYQr4mFuaoRTBLR3PWGZqerKYhUAGYagK7qhmahT0MgSD1XljWcFUswzAoEuXlpg9AzRPCoNPgK6iKK8tQNvBYF3eeSXvKIhlMQzXC45VhZ+qJUCLYLhaUNeWyjYEaFsYdjUU8dbLtrC5wYVrzapDx3cYrmBsLRSf606Nd1irK1FoObfCoGsoa0YAa3mrArR/sADnq7SDCZYtDbDQuo5H12aF7AsG6xapWoSoCtknDNagVrnw+7zyYOMF87DdRXXvHtgep1D2Kn65IVdLtyN0cRbO2WvLT8Dl2vpD6TbZkuw/09zsCyynmkrec8IxEHT6svDqzH8zDK9GmrZt1Y3RUj1U6Do+Mm0lx7j5Ht92hYwbPDJuicm4iSjjtqucG9Vybu37vagMmyG/z12X9tF/APITr9CCbDsMAAAAAElFTkSuQmCC",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  [defs.PROP_IS_EDITING]: false,
  [defs.PROP_IS_DELETING_LINK]: false,
  [defs.PROP_SELECTED_ACCOUNT]: {},
  [defs.PROP_IS_READY]: true,
  [defs.PROP_NEEDS_UPDATE]: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case defs.actionTypes.onSetAccounts: {
      return state.set(defs.PROP_ACCOUNTS, Immutable.fromJS(action.value));
    }
    case defs.actionTypes.onAddAccounts: {
      const accounts = state.get(defs.PROP_ACCOUNTS);

      return state.set(
        defs.PROP_ACCOUNTS,
        accounts.concat(Immutable.fromJS(action.value)),
      );
    }
    case defs.actionTypes.onDeleteAccounts: {
      const accounts = state.get(defs.PROP_ACCOUNTS);

      return state.set(
        defs.PROP_ACCOUNTS,
        accounts.filter(item => !action.value.includes(item.get("id"))),
      );
    }
    case defs.actionTypes.onSetIsEditing: {
      // reset selected account as well
      return state
        .set(defs.PROP_SELECTED_ACCOUNT, Immutable.fromJS({}))
        .set(defs.PROP_IS_EDITING, action.value);
    }
    case defs.actionTypes.onSetIsDeletingLink: {
      return state.set(defs.PROP_IS_DELETING_LINK, action.value);
    }
    case defs.actionTypes.onSetIsReady: {
      return state.set(defs.PROP_IS_READY, action.value);
    }
    case defs.actionTypes.onSetNeedsUpdate: {
      return state.set(defs.PROP_NEEDS_UPDATE, action.value);
    }
    case defs.actionTypes.onSelectAccount: {
      return state.set(
        defs.PROP_SELECTED_ACCOUNT,
        Immutable.fromJS(action.value),
      );
    }
    default: {
      return state;
    }
  }
};
