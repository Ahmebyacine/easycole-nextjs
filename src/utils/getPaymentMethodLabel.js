export function getPaymentMethodLabel(method) {
  switch (method) {
    case "cash":
      return "نقدًا";
    case "ccp":
      return "تحويل بريدي";
    case "baridimob":
      return "بريدي موب";
    default:
      return "غير محدد";
  }
}