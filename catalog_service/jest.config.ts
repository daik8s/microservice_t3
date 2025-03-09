/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // Sử dụng preset "ts-jest" để Jest có thể hiểu và kiểm thử mã TypeScript
  clearMocks: true, // Mỗi khi chạy lại kiểm thử, Jest sẽ tự động làm sạch mocks (tình huống giả lập) trước khi chạy
  collectCoverage: true, // Bật tính năng thu thập báo cáo phủ sóng (code coverage) trong quá trình kiểm thử
  verbose: true, // Cung cấp thông tin chi tiết hơn về kết quả kiểm thử trong terminal hoặc báo cáo
  coverageDirectory: "coverage", // Chỉ định thư mục nơi Jest sẽ lưu trữ các báo cáo phủ sóng
  coverageProvider: "v8", // Sử dụng công cụ "v8" để tính toán báo cáo phủ sóng, thường được chọn vì nó nhanh hơn và chính xác
  coveragePathIgnorePatterns: ["/node_modules"], // Loại trừ thư mục "node_modules" khỏi việc tính toán phủ sóng, vì đây là mã bên ngoài không cần kiểm thử,
  moduleDirectories: ["node_modules", "src"]
};

export default config;
