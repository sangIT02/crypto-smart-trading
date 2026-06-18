package com.financial.stockapp.component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.financial.stockapp.dto.response.SymbolInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class BinanceExchangeInfoParser {
    private final ObjectMapper mapper = new ObjectMapper();

    public List<SymbolInfoDTO> parsePayload(String jsonPayload) {
        List<SymbolInfoDTO> resultList = new ArrayList<>();
        try {
            // Đọc toàn bộ chuỗi JSON thành JsonNode gốc
            JsonNode rootNode = mapper.readTree(jsonPayload);

            // Trỏ thẳng vào mảng "symbols"
            JsonNode symbolsArray = rootNode.path("symbols");

            if (symbolsArray.isArray()) {
                for (JsonNode symbolNode : symbolsArray) {

                    // 1. Bỏ qua các cặp không được giao dịch
                    if (!"TRADING".equals(symbolNode.path("status").asText())) {
                        continue;
                    }

                    // 2. Khởi tạo DTO Builder và nạp thông tin cơ bản
                    SymbolInfoDTO.SymbolInfoDTOBuilder builder = SymbolInfoDTO.builder()
                            .symbol(symbolNode.path("symbol").asText())
                            .baseAsset(symbolNode.path("baseAsset").asText())
                            .quoteAsset(symbolNode.path("quoteAsset").asText())
                            .pricePrecision(symbolNode.path("pricePrecision").asInt())
                            .quantityPrecision(symbolNode.path("quantityPrecision").asInt());

                    // 3. Trỏ vào mảng "filters" để moi các thông số sống còn
                    JsonNode filtersArray = symbolNode.path("filters");
                    if (filtersArray.isArray()) {
                        for (JsonNode filterNode : filtersArray) {
                            String filterType = filterNode.path("filterType").asText();

                            switch (filterType) {
                                case "PRICE_FILTER":
                                    builder.tickSize(new BigDecimal(filterNode.path("tickSize").asText()));
                                    break;
                                case "LOT_SIZE":
                                    builder.minQty(new BigDecimal(filterNode.path("minQty").asText()));
                                    builder.stepSize(new BigDecimal(filterNode.path("stepSize").asText()));
                                    break;
                                case "MIN_NOTIONAL":
                                    // Chú ý: Ở Futures JSON field tên là "notional"
                                    builder.minNotional(new BigDecimal(filterNode.path("notional").asText("0")));
                                    break;
                            }
                        }
                    }

                    // 4. Hoàn thiện 1 DTO và nhét vào mảng kết quả
                    resultList.add(builder.build());
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi parse ExchangeInfo JSON: ", e);
        }

        return resultList;
    }
}