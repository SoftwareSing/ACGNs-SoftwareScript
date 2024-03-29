import { EventController } from 'Global/EventController';
import { AccessedRecorder } from 'DisconnectReminder/AccessedRecorder';
import { DisconnectReminderView } from 'DisconnectReminder/DisconnectReminderView';

export class DisconnectReminderController extends EventController {
  constructor(loginUser) {
    super('DisconnectReminderController', loginUser);

    const disconnectReminderSwitch = JSON.parse(window.localStorage.getItem('SoftwareScript.disconnectReminderSwitch'));
    if (! disconnectReminderSwitch) {
      return;
    }

    this.disconnectReminderView = new DisconnectReminderView();
    this.turnOnAllReminder();
  }

  turnOnAllReminder() {
    // this.accountOwnStocksReminder();
    this.companyProductCenterInfoReminder();
    this.companyMarketingProductsReminder();
    // this.currentUserVoteRecordReminder();
    // this.companyCurrentUserOwnedProductsReminder();

    // this.accuseRecordReminder();
    // this.allRuleAgendaReminder();
    // this.onlinePeopleNumberReminder();
    // this.displayAdvertisingReminder();
    // this.lastImportantAccuseLogDateReminder();
    // this.currentUserUnreadAnnouncementCount();

    this.accountInfoReminder();
    this.employeeListByUserReminder();
    this.accountChairmanTitleReminder();
    this.accountManagerTitleReminder();
    this.accounEmployeeTitleReminder();
    this.accountVipTitleReminder();
    this.accountInfoTaxReminder();
    this.accountInfoLogReminder();
    this.userPlacedStonesReminder();

    this.companyDataForEditReminder();

    // this.ruleAgendaDetailReminder();
    // this.currentRoundReminder();
    // this.currentSeasonReminder();
    // this.currentArenaReminder();
    // this.userCreatedAtReminder();
    // this.userFavoriteReminder();

    this.userOwnedProductsReminder();
    this.companyListReminder();

    // this.adjacentSeasonReminder();
    // this.productListBySeasonIdReminder(); //未限制
    // this.rankListBySeasonIdReminder();

    this.companyVipsReminder();
    // this.currentUserCompanyVipReminder();

    this.foundationListReminder();
    this.foundationDetailReminder();
    this.foundationDataForEditReminder();

    this.companyMiningMachineInfoReminder();
    this.companyStonesReminder();
    this.companyCurrentUserPlacedStonesReminder();
    this.companyLogReminder();
    this.productListByCompanyReminder();
    this.companyDetailReminder();
    this.employeeListByCompanyReminder();
    this.companyDirectorReminder();
    this.companyArenaInfoReminder();

    // this.legacyAnnouncementDetailReminder();
    // this.validateUserReminder();

    // this.announcementListReminder();
    // this.allAdvertisingReminder();
    this.arenaInfoReminder();
    // this.adjacentArenaReminder();
    this.arenaLogReminder();
    // this.fscMembersReminder();

    this.currentUserOrdersReminder();
    this.currentUserDirectorsReminder();
    this.companyOrdersReminder();
  }

  createReminder(recorder) {
    return () => {
      recorder.addRecord();
      const { shouldWarning, count, firstTime } = recorder.getWarningInfo();
      if (shouldWarning) {
        this.disconnectReminderView.displayWarningDialog(recorder.name, count,
          Math.ceil(((firstTime + recorder.interval) - Date.now()) / 1000)
        );
      }
    };
  }

  accountOwnStocksReminder() {
    //this.subscribe('accountOwnStocks'
    this.accountOwnStocks = new AccessedRecorder('accountOwnStocks');
    const reminder = this.createReminder(this.accountOwnStocks);
    this.templateListener(Template.fscStock, 'Template.fscStock', reminder);
    this.templateListener(Template.accountInfoOwnStockList, 'Template.accountInfoOwnStockList', reminder);
  }
  companyProductCenterInfoReminder() {
    //this.subscribe('companyProductCenterInfo'
    this.companyProductCenterInfo = new AccessedRecorder('companyProductCenterInfo');
    const reminder = this.createReminder(this.companyProductCenterInfo);
    this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
  }
  companyMarketingProductsReminder() {
    //this.subscribe('companyMarketingProducts'
    this.companyMarketingProducts = new AccessedRecorder('companyMarketingProducts');
    const reminder = this.createReminder(this.companyMarketingProducts);
    this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
  }
  currentUserVoteRecordReminder() {
    //this.subscribe('currentUserVoteRecord'
    this.currentUserVoteRecord = new AccessedRecorder('currentUserVoteRecord', 30, 10000);
    const reminder = this.createReminder(this.currentUserVoteRecord);
    this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
    this.templateListener(Template.productInfoBySeasonTable, 'Template.productInfoBySeasonTable', reminder);
    this.templateListener(Template.productCenterByCompany, 'Template.productCenterByCompany', reminder);
  }
  companyCurrentUserOwnedProductsReminder() {
    //this.subscribe('companyCurrentUserOwnedProducts'
    this.companyCurrentUserOwnedProducts = new AccessedRecorder('companyCurrentUserOwnedProducts');
    const reminder = this.createReminder(this.companyCurrentUserOwnedProducts);
    this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
  }

  accuseRecordReminder() {
    //this.subscribe('accuseRecord'
    this.accuseRecord = new AccessedRecorder('accuseRecord', 10);
    const reminder = this.createReminder(this.accuseRecord);
    this.templateListener(Template.accuseRecord, 'Template.accuseRecord', reminder);
  }
  allRuleAgendaReminder() {
    //this.subscribe('allRuleAgenda'
    this.allRuleAgenda = new AccessedRecorder('allRuleAgenda', 5);
    const reminder = this.createReminder(this.allRuleAgenda);
    this.templateListener(Template.ruleAgendaList, 'Template.ruleAgendaList', reminder);
  }
  onlinePeopleNumberReminder() {
    //this.subscribe('onlinePeopleNumber'
    this.onlinePeopleNumber = new AccessedRecorder('onlinePeopleNumber', 5);
    const reminder = this.createReminder(this.onlinePeopleNumber);
    this.templateListener(Template.footer, 'Template.footer', reminder);
  }
  displayAdvertisingReminder() {
    //this.subscribe('displayAdvertising'
    this.displayAdvertising = new AccessedRecorder('displayAdvertising', 5);
    const reminder = this.createReminder(this.displayAdvertising);
    this.templateListener(Template.footer, 'Template.footer', reminder);
  }
  lastImportantAccuseLogDateReminder() {
    //this.subscribe('lastImportantAccuseLogDate'
    this.lastImportantAccuseLogDate = new AccessedRecorder('lastImportantAccuseLogDate');
    const reminder = this.createReminder(this.lastImportantAccuseLogDate);
    this.templateListener(Template.unreadImportantAccuseLogsNotification, 'Template.unreadImportantAccuseLogsNotification', reminder);
  }
  currentUserUnreadAnnouncementCount() {
    //this.subscribe('currentUserUnreadAnnouncementCount'
    this.currentUserUnreadAnnouncementCount = new AccessedRecorder('currentUserUnreadAnnouncementCount');
    const reminder = this.createReminder(this.currentUserUnreadAnnouncementCount);
    this.templateListener(Template.displayAnnouncementUnreadNotification, 'Template.displayAnnouncementUnreadNotification', reminder);
  }

  accountInfoReminder() {
    //this.subscribe('accountInfo'
    this.accountInfo = new AccessedRecorder('accountInfo');
    const reminder = this.createReminder(this.accountInfo);
    this.templateListener(Template.accountInfo, 'Template.accountInfo', reminder);
  }
  employeeListByUserReminder() {
    //this.subscribe('employeeListByUser'
    this.employeeListByUser = new AccessedRecorder('employeeListByUser');
    const reminder = this.createReminder(this.employeeListByUser);
    this.templateListener(Template.accountInfo, 'Template.accountInfo', reminder);
  }
  accountChairmanTitleReminder() {
    //this.subscribe('accountChairmanTitle'
    this.accountChairmanTitle = new AccessedRecorder('accountChairmanTitle');
    const reminder = this.createReminder(this.accountChairmanTitle);
    this.templateListener(Template.chairmanTitleList, 'Template.chairmanTitleList', reminder);
  }
  accountManagerTitleReminder() {
    //this.subscribe('accountManagerTitle'
    this.accountManagerTitle = new AccessedRecorder('accountManagerTitle');
    const reminder = this.createReminder(this.accountManagerTitle);
    this.templateListener(Template.managerTitleList, 'Template.managerTitleList', reminder);
  }
  accounEmployeeTitleReminder() {
    //this.subscribe('accounEmployeeTitle'
    this.accounEmployeeTitle = new AccessedRecorder('accounEmployeeTitle');
    const reminder = this.createReminder(this.accounEmployeeTitle);
    this.templateListener(Template.employeeTitleList, 'Template.employeeTitleList', reminder);
  }
  accountVipTitleReminder() {
    //this.subscribe('accountVipTitle'
    this.accountVipTitle = new AccessedRecorder('accountVipTitle');
    const reminder = this.createReminder(this.accountVipTitle);
    this.templateListener(Template.vipTitleList, 'Template.vipTitleList', reminder);
  }
  accountInfoTaxReminder() {
    //this.subscribe('accountInfoTax'
    this.accountInfoTax = new AccessedRecorder('accountInfoTax');
    const reminder = this.createReminder(this.accountInfoTax);
    this.templateListener(Template.accountInfoTaxList, 'Template.accountInfoTaxList', reminder);
  }
  accountInfoLogReminder() {
    //this.subscribe('accountInfoLog'
    this.accountInfoLog = new AccessedRecorder('accountInfoLog');
    const reminder = this.createReminder(this.accountInfoLog);
    this.templateListener(Template.accountInfoLogList, 'Template.accountInfoLogList', reminder);
  }
  userPlacedStonesReminder() {
    //this.subscribe('userPlacedStones'
    this.userPlacedStones = new AccessedRecorder('userPlacedStones');
    const reminder = this.createReminder(this.userPlacedStones);
    this.templateListener(Template.accountInfoStonePanel, 'Template.accountInfoStonePanel', reminder);
  }

  companyDataForEditReminder() {
    //this.subscribe('companyDataForEdit'
    this.companyDataForEdit = new AccessedRecorder('companyDataForEdit', 10);
    const reminder = this.createReminder(this.companyDataForEdit);
    this.templateListener(Template.editCompany, 'Template.editCompany', reminder);
  }

  ruleAgendaDetailReminder() {
    //this.subscribe('ruleAgendaDetail'
    this.ruleAgendaDetail = new AccessedRecorder('ruleAgendaDetail', 5);
    const reminder = this.createReminder(this.ruleAgendaDetail);
    this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
    this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
  }
  currentRoundReminder() {
    //this.subscribe('currentRound'
    this.currentRound = new AccessedRecorder('currentRound', 5);
    const reminder = this.createReminder(this.currentRound);
    this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
    this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
    this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
  }
  currentSeasonReminder() {
    //this.subscribe('currentSeason'
    this.currentSeason = new AccessedRecorder('currentSeason', 5);
    const reminder = this.createReminder(this.currentSeason);
    this.templateListener(Template.nav, 'Template.nav', reminder);
    this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
  }
  currentArenaReminder() {
    //this.subscribe('currentArena'
    this.currentArena = new AccessedRecorder('currentArena', 5);
    const reminder = this.createReminder(this.currentArena);
    this.templateListener(Template.nav, 'Template.nav', reminder);
  }
  userCreatedAtReminder() {
    //this.subscribe('userCreatedAt'
    this.userCreatedAt = new AccessedRecorder('userCreatedAt');
    const reminder = this.createReminder(this.userCreatedAt);
    this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
    this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
  }
  userFavoriteReminder() {
    //this.subscribe('userFavorite'
    this.userFavorite = new AccessedRecorder('userFavorite');
    const reminder = this.createReminder(this.userFavorite);
    this.templateListener(Template.nav, 'Template.nav', reminder);
  }

  userOwnedProductsReminder() {
    //this.subscribe('userOwnedProducts'
    this.userOwnedProducts = new AccessedRecorder('userOwnedProducts');
    const reminder = this.createReminder(this.userOwnedProducts);
    this.templateListener(Template.accountInfoOwnedProductsPanel, 'Template.accountInfoOwnedProductsPanel', reminder);
  }
  companyListReminder() {
    //this.subscribe('companyList'
    this.companyList = new AccessedRecorder('companyList');
    const reminder = this.createReminder(this.companyList);
    this.templateListener(Template.companyList, 'Template.companyList', reminder);
  }

  adjacentSeasonReminder() {
    //this.subscribe('adjacentSeason'
    this.adjacentSeason = new AccessedRecorder('adjacentSeason');
    const reminder = this.createReminder(this.adjacentSeason);
    this.templateListener(Template.productCenterBySeason, 'Template.productCenterBySeason', reminder);
    this.templateListener(Template.seasonalReport, 'Template.seasonalReport', reminder);
  }
  productListBySeasonIdReminder() {
    //this.subscribe('productListBySeasonId'
    this.productListBySeasonId = new AccessedRecorder('productListBySeasonId');
    const reminder = this.createReminder(this.productListBySeasonId);
    this.templateListener(Template.productCenterBySeason, 'Template.productCenterBySeason', reminder);
  }
  rankListBySeasonIdReminder() {
    //this.subscribe('rankListBySeasonId'
    this.rankListBySeasonId = new AccessedRecorder('rankListBySeasonId', 30);
    const reminder = this.createReminder(this.rankListBySeasonId);
    this.templateListener(Template.seasonalReport, 'Template.seasonalReport', reminder);
  }

  companyVipsReminder() {
    //this.subscribe('companyVips'
    this.companyVips = new AccessedRecorder('companyVips');
    const reminder = this.createReminder(this.companyVips);
    this.templateListener(Template.companyVipListPanel, 'Template.companyVipListPanel', reminder);
  }
  currentUserCompanyVipReminder() {
    //this.subscribe('currentUserCompanyVip'
    this.currentUserCompanyVip = new AccessedRecorder('currentUserCompanyVip');
    const reminder = this.createReminder(this.currentUserCompanyVip);
    this.templateListener(Template.companyVipListPanel, 'Template.companyVipListPanel', reminder);
  }

  foundationListReminder() {
    //this.subscribe('foundationList'
    this.foundationList = new AccessedRecorder('foundationList');
    const reminder = this.createReminder(this.foundationList);
    this.templateListener(Template.foundationList, 'Template.foundationList', reminder);
  }
  foundationDetailReminder() {
    //this.subscribe('foundationDetail'
    this.foundationDetail = new AccessedRecorder('foundationDetail', 10);
    const reminder = this.createReminder(this.foundationDetail);
    this.templateListener(Template.foundationDetail, 'Template.foundationDetail', reminder);
  }
  foundationDataForEditReminder() {
    //this.subscribe('foundationDataForEdit'
    this.foundationDataForEdit = new AccessedRecorder('foundationDataForEdit', 10);
    const reminder = this.createReminder(this.foundationDataForEdit);
    this.templateListener(Template.editFoundationPlan, 'Template.editFoundationPlan', reminder);
  }

  companyMiningMachineInfoReminder() {
    //this.subscribe('companyMiningMachineInfo'
    this.companyMiningMachineInfo = new AccessedRecorder('companyMiningMachineInfo');
    const reminder = this.createReminder(this.companyMiningMachineInfo);
    this.templateListener(Template.companyMiningMachine, 'Template.companyMiningMachine', reminder);
  }
  companyStonesReminder() {
    //this.subscribe('companyStones'
    this.companyStones = new AccessedRecorder('companyStones');
    const reminder = this.createReminder(this.companyStones);
    this.templateListener(Template.companyMiningMachine, 'Template.companyMiningMachine', reminder);
  }
  companyCurrentUserPlacedStonesReminder() {
    //this.subscribe('companyCurrentUserPlacedStones'
    this.companyCurrentUserPlacedStones = new AccessedRecorder('companyCurrentUserPlacedStones');
    const reminder = this.createReminder(this.companyCurrentUserPlacedStones);
    this.templateListener(Template.companyMiningMachine, 'Template.companyMiningMachine', reminder);
  }
  companyLogReminder() {
    //this.subscribe('companyLog'
    this.companyLog = new AccessedRecorder('companyLog');
    const reminder = this.createReminder(this.companyLog);
    this.templateListener(Template.foundationLogList, 'Template.foundationLogList', reminder);
    this.templateListener(Template.companyLogList, 'Template.companyLogList', reminder);
  }
  productListByCompanyReminder() {
    //this.subscribe('productListByCompany'
    this.productListByCompany = new AccessedRecorder('productListByCompany');
    const reminder = this.createReminder(this.productListByCompany);
    this.templateListener(Template.productCenterByCompany, 'Template.productCenterByCompany', reminder);
  }
  companyDetailReminder() {
    //this.subscribe('companyDetail'
    this.companyDetail = new AccessedRecorder('companyDetail');
    const reminder = this.createReminder(this.companyDetail);
    this.templateListener(Template.companyDetail, 'Template.companyDetail', reminder);
  }
  employeeListByCompanyReminder() {
    //this.subscribe('employeeListByCompany'
    this.employeeListByCompany = new AccessedRecorder('employeeListByCompany');
    const reminder = this.createReminder(this.employeeListByCompany);
    this.templateListener(Template.companyDetailNormalContent, 'Template.companyDetailNormalContent', reminder);
  }
  companyDirectorReminder() {
    //this.subscribe('companyDirector'
    this.companyDirector = new AccessedRecorder('companyDirector');
    const reminder = this.createReminder(this.companyDirector);
    this.templateListener(Template.companyDirectorList, 'Template.companyDirectorList', reminder);
  }
  companyArenaInfoReminder() {
    //this.subscribe('companyArenaInfo'
    this.companyArenaInfo = new AccessedRecorder('companyArenaInfo');
    const reminder = this.createReminder(this.companyArenaInfo);
    this.templateListener(Template.companyArenaInfo, 'Template.companyArenaInfo', reminder);
  }

  legacyAnnouncementDetailReminder() {
    //this.subscribe('legacyAnnouncementDetail'
    this.legacyAnnouncementDetail = new AccessedRecorder('legacyAnnouncementDetail', 5);
    const reminder = this.createReminder(this.legacyAnnouncementDetail);
    this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
  }
  validateUserReminder() {
    //this.subscribe('validateUser'
    this.validateUser = new AccessedRecorder('validateUser');
    const reminder = this.createReminder(this.validateUser);
    this.templateListener(Template.accountDialog, 'Template.accountDialog', reminder);
  }

  announcementListReminder() {
    //this.subscribe('announcementList'
    this.announcementList = new AccessedRecorder('announcementList');
    const reminder = this.createReminder(this.announcementList);
    this.templateListener(Template.announcementList, 'Template.announcementList', reminder);
  }
  allAdvertisingReminder() {
    //this.subscribe('allAdvertising'
    this.allAdvertising = new AccessedRecorder('allAdvertising', 10);
    const reminder = this.createReminder(this.allAdvertising);
    this.templateListener(Template.advertising, 'Template.advertising', reminder);
  }

  arenaInfoReminder() {
    //this.subscribe('arenaInfo'
    this.arenaInfo = new AccessedRecorder('arenaInfo');
    const reminder = this.createReminder(this.arenaInfo);
    this.templateListener(Template.arenaInfo, 'Template.arenaInfo', reminder);
  }
  adjacentArenaReminder() {
    //this.subscribe('adjacentArena'
    this.adjacentArena = new AccessedRecorder('adjacentArena');
    const reminder = this.createReminder(this.adjacentArena);
    this.templateListener(Template.arenaInfo, 'Template.arenaInfo', reminder);
  }
  arenaLogReminder() {
    //this.subscribe('arenaLog'
    this.arenaLog = new AccessedRecorder('arenaLog');
    const reminder = this.createReminder(this.arenaLog);
    this.templateListener(Template.arenaInfoLogList, 'Template.arenaInfoLogList', reminder);
  }

  fscMembersReminder() {
    //this.subscribe('fscMembers'
    this.fscMembers = new AccessedRecorder('fscMembers');
    const reminder = this.createReminder(this.fscMembers);
    this.templateListener(Template.tutorial, 'Template.tutorial', reminder);
  }

  currentUserOrdersReminder() {
    //this.subscribe('currentUserOrders'
    this.currentUserOrders = new AccessedRecorder('currentUserOrders');
    const reminder = this.createReminder(this.currentUserOrders);
    this.templateListener(Template.companyOrderBook, 'Template.companyOrderBook', reminder);
  }
  currentUserDirectorsReminder() {
    //this.subscribe('currentUserDirectors'
    this.currentUserDirectors = new AccessedRecorder('currentUserDirectors');
    const reminder = this.createReminder(this.currentUserDirectors);
    this.templateListener(Template.companyOrderBook, 'Template.companyOrderBook', reminder);
  }
  companyOrdersReminder() {
    //this.subscribe('companyOrders'
    this.companyOrders = new AccessedRecorder('companyOrders');
    const reminder = this.createReminder(this.companyOrders);
    this.templateListener(Template.companyOrderList, 'Template.companyOrderList', reminder);
  }


  newReminder() {
    //this.subscribe('AAAAAAAAAAAAAAAAAA'
    this.AAAAAAAAAAAAAAAAAA = new AccessedRecorder('AAAAAAAAAAAAAAAAAA');
    const reminder = this.createReminder(this.AAAAAAAAAAAAAAAAAA);
    this.templateListener(Template.BBBBBBBBBB, 'Template.BBBBBBBBBB', reminder);
  }
}
