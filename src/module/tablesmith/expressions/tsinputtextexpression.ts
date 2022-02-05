import { evalcontext } from './evaluationcontextinstance';
import TSExpression, { BaseTSExpression } from './tsexpression';
import TSExpressionResult from './tsexpressionresult';

/**
 * Expression that asks for Input via Callback and returns entered text.
 */
export default class TSInputTextExpression extends BaseTSExpression {
  prompt: TSExpression;
  defaultValue: TSExpression;

  constructor(defaultValue: TSExpression, prompt: TSExpression) {
    super();
    this.defaultValue = defaultValue;
    this.prompt = prompt;
  }

  async evaluate(): Promise<TSExpressionResult> {
    const prompt = (await this.prompt.evaluate()).asString().trim();
    const value = (await this.defaultValue.evaluate()).asString().trim();
    const result = await evalcontext.promptForInputText(prompt, value);
    return new TSExpressionResult(result);
  }

  getExpression(): string {
    return `{InputText~${this.defaultValue.getExpression()},${this.prompt.getExpression()}}`;
  }
}