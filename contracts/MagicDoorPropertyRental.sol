pragma solidity ^0.8.0;

contract MagicDoorPropertyRental {
    // Mapping of property IDs to their respective owners
    mapping (uint => address) public propertyOwners;

    // Mapping of property IDs to their respective rental status
    mapping (uint => bool) public isRented;

    // Event emitted when a property is rented
    event PropertyRented(uint indexed propertyId, address indexed renter);

    // Event emitted when a property is returned
    event PropertyReturned(uint indexed propertyId);

    // Function to rent a property
    function rentProperty(uint _propertyId) public {
        require(propertyOwners[_propertyId] != address(0), "Property does not exist");
        require(!isRented[_propertyId], "Property is already rented");

        isRented[_propertyId] = true;
        emit PropertyRented(_propertyId, msg.sender);
    }

    // Function to return a property
    function returnProperty(uint _propertyId) public {
        require(propertyOwners[_propertyId] != address(0), "Property does not exist");
        require(isRented[_propertyId], "Property is not rented");

        isRented[_propertyId] = false;
        emit PropertyReturned(_propertyId);
    }
}