// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract todo {
    struct Todo {
        string contents;
        bool is_opened;
        bool is_deleted;
    }

    Todo[] public todos;

    mapping(uint256 => address) public todoToOwner;
    mapping(address => uint256) todoCountByOwner;

    modifier onlyMine(uint256 id) {
        require(msg.sender == todoToOwner[id]);
        _;
    }

    function getTODO() external view returns (uint256[] memory) {
        if (todoCountByOwner[msg.sender] == 0) {
            return new uint256[](0);
        }

        uint256[] memory result = new uint256[](todoCountByOwner[msg.sender]);
        uint256 counter = 0;

        for (uint256 i = 0; i < todos.length; i++) {
            if (todoToOwner[i] == msg.sender && todos[i].is_deleted == false) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function createTODO(string memory _contents) public returns (uint256) {
        todos.push(Todo(_contents, true, false));
        uint256 id = todos.length - 1;
        todoToOwner[id] = msg.sender;
        todoCountByOwner[msg.sender]++;
        return id;
    }

    function updateTODO(uint256 _id, bool _is_opened) public onlyMine(_id) {
        todos[_id].is_opened = _is_opened;
    }

    function deleteTODO(uint256 _id) public onlyMine(_id) {
        require(todos[_id].is_deleted == false);

        todos[_id].is_deleted = true;
        todoCountByOwner[msg.sender]--;
    }
}
