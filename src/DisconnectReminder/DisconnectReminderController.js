import { EventController } from '../Global/EventController';
import { AccessedRecorder } from './AccessedRecorder';
import { DisconnectReminderView } from './DisconnectReminderView';

export class DisconnectReminderController extends EventController {
  constructor(loginUser) {
    super('DisconnectReminderController', loginUser);
    this.disconnectReminderView = new DisconnectReminderView();
  }

  createReminder(recorder) {
    return () => {
      recorder.addRecord();
      const { count, firstTime } = recorder.checkAccessedCount();
      if (count >= 19) {
        const time = new Date();
        this.disconnectReminderView.displayWarningDialog(recorder.name, count,
          Math.ceil(((60000 - firstTime) - time.getTime()) / 1000)
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
    this.currentUserVoteRecord = new AccessedRecorder('currentUserVoteRecord');
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
    this.accuseRecord = new AccessedRecorder('accuseRecord');
    const reminder = this.createReminder(this.accuseRecord);
    this.templateListener(Template.accuseRecord, 'Template.accuseRecord', reminder);
  }
  allRuleAgendaReminder() {
    //this.subscribe('allRuleAgenda'
    this.allRuleAgenda = new AccessedRecorder('allRuleAgenda');
    const reminder = this.createReminder(this.allRuleAgenda);
    this.templateListener(Template.ruleAgendaList, 'Template.ruleAgendaList', reminder);
  }
  onlinePeopleNumberReminder() {
    //this.subscribe('onlinePeopleNumber'
    this.onlinePeopleNumber = new AccessedRecorder('onlinePeopleNumber');
    const reminder = this.createReminder(this.onlinePeopleNumber);
    this.templateListener(Template.footer, 'Template.footer', reminder);
  }
  displayAdvertisingReminder() {
    //this.subscribe('displayAdvertising'
    this.displayAdvertising = new AccessedRecorder('displayAdvertising');
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
    this.companyDataForEdit = new AccessedRecorder('companyDataForEdit');
    const reminder = this.createReminder(this.companyDataForEdit);
    this.templateListener(Template.editCompany, 'Template.editCompany', reminder);
  }

  ruleAgendaDetailReminder() {
    //this.subscribe('ruleAgendaDetail'
    this.ruleAgendaDetail = new AccessedRecorder('ruleAgendaDetail');
    const reminder = this.createReminder(this.ruleAgendaDetail);
    this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
    this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
  }
  currentRoundReminder() {
    //this.subscribe('currentRound'
    this.currentRound = new AccessedRecorder('currentRound');
    const reminder = this.createReminder(this.currentRound);
    this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
    this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
    this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
  }
  currentSeasonReminder() {
    //this.subscribe('currentSeason'
    this.currentSeason = new AccessedRecorder('currentSeason');
    const reminder = this.createReminder(this.currentSeason);
    this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
  }
  userCreatedAtReminder() {
    //this.subscribe('userCreatedAt'
    this.userCreatedAt = new AccessedRecorder('userCreatedAt');
    const reminder = this.createReminder(this.userCreatedAt);
    this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
    this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
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
  queryOwnStocksReminder() {
    //this.subscribe('queryOwnStocks'
    this.queryOwnStocks = new AccessedRecorder('queryOwnStocks');
    const reminder = this.createReminder(this.queryOwnStocks);
    this.templateListener(Template.companyList, 'Template.companyList', reminder);
    this.templateListener(Template.companyBuyOrderList, 'Template.companyBuyOrderList', reminder);
    this.templateListener(Template.companyDirectorList, 'Template.companyDirectorList', reminder);
  }
  queryMyOrderReminder() {
    //this.subscribe('queryMyOrder'
    this.queryMyOrder = new AccessedRecorder('queryMyOrder');
    const reminder = this.createReminder(this.queryMyOrder);
    this.templateListener(Template.companyList, 'Template.companyList', reminder);
    this.templateListener(Template.companyBuyOrderList, 'Template.companyBuyOrderList', reminder);
  }
  companyOrderExcludeMeReminder() {
    //this.subscribe('companyOrderExcludeMe'
    this.companyOrderExcludeMe = new AccessedRecorder('companyOrderExcludeMe');
    const reminder = this.createReminder(this.companyOrderExcludeMe);
    this.templateListener(Template.companyBuyOrderList, 'Template.companyBuyOrderList', reminder);
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
    this.rankListBySeasonId = new AccessedRecorder('rankListBySeasonId');
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
    this.foundationDetail = new AccessedRecorder('foundationDetail');
    const reminder = this.createReminder(this.foundationDetail);
    this.templateListener(Template.foundationDetail, 'Template.foundationDetail', reminder);
  }
  foundationDataForEditReminder() {
    //this.subscribe('foundationDataForEdit'
    this.foundationDataForEdit = new AccessedRecorder('foundationDataForEdit');
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
    this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', reminder);
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
    this.legacyAnnouncementDetail = new AccessedRecorder('legacyAnnouncementDetail');
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
    this.allAdvertising = new AccessedRecorder('allAdvertising');
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
    this.templateListener(Template.arenaLogList, 'Template.arenaLogList', reminder);
  }

  fscMembersReminder() {
    //this.subscribe('fscMembers'
    this.fscMembers = new AccessedRecorder('fscMembers');
    const reminder = this.createReminder(this.fscMembers);
    this.templateListener(Template.tutorial, 'Template.tutorial', reminder);
  }


  newReminder() {
    //this.subscribe('AAAAAAAAAAAAAAAAAA'
    this.AAAAAAAAAAAAAAAAAA = new AccessedRecorder('AAAAAAAAAAAAAAAAAA');
    const reminder = this.createReminder(this.AAAAAAAAAAAAAAAAAA);
    this.templateListener(Template.BBBBBBBBBB, 'Template.BBBBBBBBBB', reminder);
  }
}
