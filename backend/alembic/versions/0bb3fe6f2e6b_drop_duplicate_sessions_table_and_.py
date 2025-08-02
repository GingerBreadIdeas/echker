"""Drop duplicate sessions table and update relationships

Revision ID: 0bb3fe6f2e6b
Revises: 001
Create Date: 2025-08-02 23:50:55.938002

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0bb3fe6f2e6b'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the old 'sessions' table (we keep 'session')
    op.drop_table('sessions')
    
    # Add session_id to chat_messages and remove user_id
    op.add_column('chat_messages', sa.Column('session_id', sa.Integer(), nullable=True))
    op.create_foreign_key('chat_messages_session_id_fkey', 'chat_messages', 'session', ['session_id'], ['id'])
    op.drop_constraint('chat_messages_user_id_fkey', 'chat_messages', type_='foreignkey')
    op.drop_index('ix_chat_messages_user_id', table_name='chat_messages')
    op.drop_column('chat_messages', 'user_id')
    
    # Add project_id to prompt_check and remove user_id
    op.add_column('prompt_check', sa.Column('project_id', sa.Integer(), nullable=True))
    op.create_foreign_key('prompt_check_project_id_fkey', 'prompt_check', 'projects', ['project_id'], ['id'])
    op.drop_constraint('prompt_check_user_id_fkey', 'prompt_check', type_='foreignkey')
    op.drop_index('ix_prompt_check_user_id', table_name='prompt_check')
    op.drop_column('prompt_check', 'user_id')
    
    # Remove is_active from user_roles (our model doesn't have it)
    op.drop_column('user_roles', 'is_active')


def downgrade() -> None:
    # Recreate sessions table
    op.create_table('sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_sessions_id', 'sessions', ['id'], unique=False)
    
    # Restore user_id to chat_messages
    op.add_column('chat_messages', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('chat_messages_user_id_fkey', 'chat_messages', 'users', ['user_id'], ['id'])
    op.create_index('ix_chat_messages_user_id', 'chat_messages', ['user_id'], unique=False)
    op.drop_constraint('chat_messages_session_id_fkey', 'chat_messages', type_='foreignkey')
    op.drop_column('chat_messages', 'session_id')
    
    # Restore user_id to prompt_check
    op.add_column('prompt_check', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('prompt_check_user_id_fkey', 'prompt_check', 'users', ['user_id'], ['id'])
    op.create_index('ix_prompt_check_user_id', 'prompt_check', ['user_id'], unique=False)
    op.drop_constraint('prompt_check_project_id_fkey', 'prompt_check', type_='foreignkey')
    op.drop_column('prompt_check', 'project_id')
    
    # Restore is_active to user_roles
    op.add_column('user_roles', sa.Column('is_active', sa.Boolean(), nullable=True))
