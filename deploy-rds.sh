#!/bin/bash
set -e

echo "=== Step 1: Getting default VPC ==="
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)
echo "VPC: $VPC_ID"

echo "=== Step 2: Getting RDS SG (already created) ==="
RDS_SG=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=greenswap-rds-sg" --query 'SecurityGroups[0].GroupId' --output text)
echo "RDS SG: $RDS_SG"

echo "=== Step 3: Creating RDS instance (this returns immediately, DB takes ~10 min) ==="
aws rds create-db-instance \
  --db-instance-identifier greenswap-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username greenswap \
  --master-user-password "GreenSwap2024!" \
  --allocated-storage 20 \
  --db-name greenswapdb \
  --vpc-security-group-ids $RDS_SG \
  --db-subnet-group-name greenswap-subnet-group \
  --no-publicly-accessible \
  --backup-retention-period 0
echo ""
echo "=== RDS is provisioning. Wait ~10 min then run: ==="
echo "aws rds describe-db-instances --db-instance-identifier greenswap-db --query 'DBInstances[0].Endpoint.Address' --output text"
echo ""
echo "Save the RDS_SG for later: $RDS_SG"
