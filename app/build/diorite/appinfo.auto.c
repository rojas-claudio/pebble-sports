#include "pebble_process_info.h"
#include "src/resource_ids.auto.h"

const PebbleProcessInfo __pbl_app_info __attribute__ ((section (".pbl_header"))) = {
  .header = "PBLAPP",
  .struct_version = { PROCESS_INFO_CURRENT_STRUCT_VERSION_MAJOR, PROCESS_INFO_CURRENT_STRUCT_VERSION_MINOR },
  .sdk_version = { PROCESS_INFO_CURRENT_SDK_VERSION_MAJOR, PROCESS_INFO_CURRENT_SDK_VERSION_MINOR },
  .process_version = { 0, 0 },
  .load_size = 0xb6b6,
  .offset = 0xb6b6b6b6,
  .crc = 0xb6b6b6b6,
  .name = "Sports",
  .company = "itsthered1",
  .icon_resource_id = RESOURCE_ID_menu_icon,
  .sym_table_addr = 0xA7A7A7A7,
  .flags = PROCESS_INFO_PLATFORM_DIORITE,
  .num_reloc_entries = 0xdeadcafe,
  .uuid = { 0x9E, 0x57, 0xA2, 0x49, 0x9A, 0x5C, 0x4D, 0xED, 0xB3, 0x74, 0x00, 0x5A, 0x47, 0x2B, 0x80, 0x49 },
  .virtual_size = 0xb6b6
};
