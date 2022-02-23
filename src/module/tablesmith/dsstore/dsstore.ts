export class DSStore {
  data: unknown[];
  name: string;
  fields: Map<string, string>;
  constructor(name: string, data: unknown[] = []) {
    this.name = name;
    this.data = data;
    this.fields = new Map();
    if (this.data.length > 0) this.initFields();
  }

  /**
   * Inializes the fields from definition object in loaded data.
   */
  private initFields(): void {
    const definition = this.getEntry(0);
    Object.getOwnPropertyNames(definition).forEach((p) => {
      this.addField(p, definition[p as keyof object]);
    });
  }

  /**
   * Creates a new Entry initialized with default vales and pushes it to end of store.
   * @returns newly created entry, that is already added to store.
   */
  createEntry(): object {
    const entry = {};
    for (const [field, defaultvalue] of this.fields) {
      Object.defineProperty(entry, field, {
        value: defaultvalue,
        writable: true,
      });
    }
    this.data.push(entry);
    return entry;
  }

  /**
   * Returns number of stored entries.
   * @returns number of stored entries.
   */
  size(): number {
    return this.data.length - 1;
  }

  /**
   * Adds field that is valid for this DSStore object.
   * @param name to add as valid field.
   * @param defaultvalue to set for field.
   */
  addField(name: string, defaultvalue: string) {
    if (this.data.length === 0) this.createEntry();
    Object.defineProperty(this.getEntry(0), name, {
      value: defaultvalue,
      writable: true,
    });
    this.fields.set(name, defaultvalue);
  }

  /**
   * Returns the value of field in entry at index.
   * @param index of Entry to get field from.
   * @param fieldName to get.
   * @returns string value of field for entry.
   */
  getEntryField(index: number, fieldName: string): string {
    if (index < 1 || index > this.size())
      throw Error(`Cannot get field '${fieldName}' for index '${index}' out of bounds '1-${this.size()}`);
    if (!this.fields.has(fieldName))
      throw Error(`Cannot get field '${fieldName}' undefined, valid fields '${[...this.fields.keys()].join(',')}'`);
    const fieldValue = this.getEntry(index)[fieldName as keyof object];
    return fieldValue;
  }

  /**
   * Returns entry.
   * @param index of entry.
   * @returns entry at index.
   */
  getEntry(index: number): object {
    return this.data[index] as object;
  }

  /**
   * Name of this store.
   * @returns name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Serializes this store to JSON and returns it.
   * @returns string JSON.stringify for stores data.
   */
  getDataAsJsonString(): string {
    return JSON.stringify(this.data, [...this.fields.keys()]);
  }
}
