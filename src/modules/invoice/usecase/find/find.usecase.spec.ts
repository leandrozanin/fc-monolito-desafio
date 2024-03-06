import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice.items.entity";
import FindInvoiceUseCase from "./find.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Teste",
  document: "12345678901",
  address: new Address(
    "Rua Teste",
    "123",
    "complemento",
    "Teste",
    "Teste",
    "12345678",
  ),
  items: [
    new InvoiceItems({
      id: new Id("1"),
      name: "Teste",
      price: 10,
    }),
    new InvoiceItems({
      id: new Id("2"),
      name: "Teste 2",
      price: 20,
    }),
  ],
});

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const mockInvoiceGateway = MockRepository();
    const usecase = new FindInvoiceUseCase(mockInvoiceGateway);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(result.id).toBeDefined();
    expect(mockInvoiceGateway.find).toHaveBeenCalled();
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items.length).toBe(invoice.items.length);
    expect(result.total).toBe(30);
  });
});
