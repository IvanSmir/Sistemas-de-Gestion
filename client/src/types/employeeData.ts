import Employee from "./employee";
import PositionEmployee from "./positionEmployee";
import Relative from "./relative";

export interface EmployeeData {
    employee: Employee;
    position: PositionEmployee;
    relatives: Relative[];
}
export default EmployeeData;