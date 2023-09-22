export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderType {
  EXTEND = 'EXTEND',
  NEW_ORDER = 'NEW_ORDER',
}

export enum OrderPaymentMethod {
  DAIBIKI = 'DAIBIKI',
  VISA_MASTER_CARD = 'VISA_MASTER_CARD',
  QR_CODE = 'QR_CODE',
  DIRECT = 'DIRECT',
}

export enum OrderWifiTemporarily {
  NOT_RECEIVED = 'NOT_RECEIVED',
  RECEIVED = 'RECEIVED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
  UNTRIGGERED = 'UNTRIGGERED',
  REJECTED = 'REJECTED',
}

export enum OrderStopType {
  STOP_LIMIT = 'STOP_LIMIT',
  STOP_MARKET = 'STOP_MARKET',
  TRAILING_STOP = 'TRAILING_STOP',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
}

export enum OrderTimeInForce {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK',
}

export enum OrderTrigger {
  LAST = 'LAST',
  INDEX = 'INDEX',
  ORACLE = 'ORACLE',
}
