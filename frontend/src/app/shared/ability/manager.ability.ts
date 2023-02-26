import {
  AbilityRule,
  ACTION_ASSIGN_SUPPORT,
  ACTION_CREATE,
  ACTION_DELETE,
  ACTION_LIST,
  ACTION_MANAGE,
  ACTION_READ,
  ACTION_SEND_TO_DPD,
  ACTION_UPDATE,
  SUBJECT_ARTICLE,
  SUBJECT_CALENDAR,
  SUBJECT_CATALOG,
  SUBJECT_CONTENT,
  SUBJECT_CONTENT_LOCATION,
  SUBJECT_CONTENT_TEMPLATE,
  SUBJECT_DASHBOARD,
  SUBJECT_FLORIST,
  SUBJECT_INVOICE,
  SUBJECT_INVOICE_STATUS_HISTORY,
  SUBJECT_LOCATION,
  SUBJECT_ORDER,
  SUBJECT_ORDER_NOTE,
  SUBJECT_ORDER_UPDATE_HISTORY,
  SUBJECT_PAYMENT,
  SUBJECT_PRODUCT,
  SUBJECT_SITE,
  SUBJECT_SITE_CATALOG,
  SUBJECT_SITE_PRODUCT,
  SUBJECT_USER,
  SUBJECT_VOUCHER,
} from '../constants/ability.constant';
import { UserSubject } from '../interfaces';

// Note:
//    Manager role is introduced in the new spreadsheet:
//    https://docs.google.com/spreadsheets/d/1sRmgK6TBciIIfhxlUfbhmDt-USR0A4l0tw0bLY5MnAM/edit#gid=482872477

export function managerAbility(subject: UserSubject): AbilityRule[] {
  return [
    // list/read/create user
    {
      action: ACTION_LIST,
      subject: SUBJECT_USER,
    },
    {
      action: ACTION_READ,
      subject: SUBJECT_USER,
    },
    {
      action: ACTION_CREATE,
      subject: SUBJECT_USER,
    },
    // update my own user only
    {
      action: ACTION_UPDATE,
      subject: SUBJECT_USER,
      conditions: { id: { $in: subject.userIds } },
    },

    // manage product
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_PRODUCT,
    },
    // manage catalog
    //   as defined in ticket: https://arcanys.atlassian.net/browse/BH-377
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_CATALOG,
    },
    // manage florist (except CSV file download)
    //   cannot download CSV as defined in ticket: https://arcanys.atlassian.net/browse/BH-686
    {
      action: ACTION_LIST,
      subject: SUBJECT_FLORIST,
    },
    {
      action: ACTION_READ,
      subject: SUBJECT_FLORIST,
    },
    {
      action: ACTION_CREATE,
      subject: SUBJECT_FLORIST,
    },
    {
      action: ACTION_UPDATE,
      subject: SUBJECT_FLORIST,
    },
    {
      action: ACTION_DELETE,
      subject: SUBJECT_FLORIST,
    },
    // manage calendar
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_CALENDAR,
    },
    // manage location
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_LOCATION,
    },
    // manage sites
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_SITE,
    },
    // manage site content
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_CONTENT,
    },
    // manage site articles
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_ARTICLE,
    },
    // manage site products
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_SITE_PRODUCT,
    },
    // manage site catalogs
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_SITE_CATALOG,
    },
    // manage site content templates
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_CONTENT_TEMPLATE,
    },
    // manage site content location
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_CONTENT_LOCATION,
    },
    // manage orders
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_ORDER,
    },
    // Can send to Order DPD
    // as for ticket: https://arcanys.atlassian.net/browse/BH-1483
    // Only the following are able to send to DPD
    // 1. Admin
    // 2. Manager
    // 3. Florist Rep
    // 4. Customer Support
    {
      action: ACTION_SEND_TO_DPD,
      subject: SUBJECT_ORDER
    },

    // manage payments
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_PAYMENT
    },
    // manage order note
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_ORDER_NOTE,
    },
    // manage order update history
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_ORDER_UPDATE_HISTORY,
    },
    // manage dashboard
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_DASHBOARD,
    },
    // Can assign orders to users
    {
      action: ACTION_ASSIGN_SUPPORT,
      subject: SUBJECT_ORDER,
    },
    // Can manage invoices
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_INVOICE,
    },
    // Can manage invoice status history
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_INVOICE_STATUS_HISTORY,
    },
    // Can manage vouchers
    {
      action: ACTION_MANAGE,
      subject: SUBJECT_VOUCHER
    }
  ];
}
